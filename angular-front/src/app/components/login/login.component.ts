import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.signIn(username, password).subscribe({
        next: data => {
          this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.reloadPage();
        },
        error: err => {
          console.log(err);
          this.errorMessage = err.error?.message || 'An error occurred during login.';
          this.isLoginFailed = true;
        }
      });
    } else {
      this.isLoginFailed = true;
      this.errorMessage = 'Please fix the errors and try again.';
    }
  }

  reloadPage(): void {
    window.location.reload();
    this.router.navigate(['/']);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
}
