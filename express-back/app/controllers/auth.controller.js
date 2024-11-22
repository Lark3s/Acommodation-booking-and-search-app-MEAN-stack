const config = require("../config/auth.config.js");
const db = require("../models");
const { users: User, roles: Role, refreshToken: RefreshToken } = db;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

function validateEmail(email) {
  const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

exports.signup = async (req, res) => {
  try {
    // Validate request
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Username, email, and password are required!" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).send({ message: "Username is already taken!" });
    }

    // Validate email format
    if (!validateEmail(req.body.email)) {
      return res.status(400).send({ message: "Invalid email format!" });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });

    await user.save();

    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      user.roles = roles.map(role => role._id);
      await user.save();
      res.send({ message: "User was registered successfully!" });
    } else {
      const role = await Role.findOne({ name: "user" });
      user.roles = [role._id];
      await user.save();
      res.send({ message: "User was registered successfully!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while signing up." });
  }
};

exports.signin = async (req, res) => {
  try {
    // Validate request
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ message: "Username and password are required!" });
    }

    console.log(req.body);

    // Check if username exists
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v");
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: config.jwtExpiration });
    const refreshToken = await RefreshToken.createToken(user);

    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());


    // Set HttpOnly cookies
    res.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: config.jwtExpiration * 1000, // Convert to milliseconds
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: config.jwtRefreshExpiration * 1000,
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
    });
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while signing in." });
  }
};

exports.refreshToken = async (req, res) => {
  const requestToken = req.cookies.refreshToken;

  console.log('refresh token was called');
  console.log('Refresh token:',requestToken,'\n');

  if (!requestToken) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });
    if (!refreshToken) {
      console.log("Refresh token is not in database!" )
      return res.status(403).json({ message: "Refresh token is not in database!" });
      
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.findByIdAndRemove(refreshToken._id);
      console.log("Refresh token was expired. Please make a new signin request");
      return res.status(403).json({ message: "Refresh token was expired. Please make a new signin request" });

    }

    const newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, { expiresIn: config.jwtExpiration });

    console.log('new access token: ', newAccessToken);

    // Set new tokens as HttpOnly cookies
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: config.jwtRefreshExpiration * 1000,
    });

    res.status(200).send({
      message: "Tokens refreshed successfully."
    });
    
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;

    console.log(req.cookies.refreshToken);
    RefreshToken.deleteOne({ token: req.cookies.refreshToken});

    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};