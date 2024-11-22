import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBoardBookingsComponent } from './user-board-bookings.component';

describe('UserBoardBookingsComponent', () => {
  let component: UserBoardBookingsComponent;
  let fixture: ComponentFixture<UserBoardBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBoardBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBoardBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
