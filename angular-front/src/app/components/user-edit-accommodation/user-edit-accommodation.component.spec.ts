import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditAccommodationComponent } from './user-edit-accommodation.component';

describe('UserEditAccommodationComponent', () => {
  let component: UserEditAccommodationComponent;
  let fixture: ComponentFixture<UserEditAccommodationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserEditAccommodationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEditAccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
