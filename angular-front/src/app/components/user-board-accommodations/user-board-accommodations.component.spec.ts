import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBoardAccommodationsComponent } from './user-board-accommodations.component';

describe('UserBoardAccommodationsComponent', () => {
  let component: UserBoardAccommodationsComponent;
  let fixture: ComponentFixture<UserBoardAccommodationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBoardAccommodationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBoardAccommodationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
