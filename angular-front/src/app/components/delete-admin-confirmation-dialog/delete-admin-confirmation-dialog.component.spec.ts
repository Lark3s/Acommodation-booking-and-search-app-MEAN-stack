import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAdminConfirmationDialogComponent } from './delete-admin-confirmation-dialog.component';

describe('DeleteAdminConfirmationDialogComponent', () => {
  let component: DeleteAdminConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteAdminConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteAdminConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAdminConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
