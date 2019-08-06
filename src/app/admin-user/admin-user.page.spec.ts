import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserPage } from './admin-user.page';

describe('AdminUserPage', () => {
  let component: AdminUserPage;
  let fixture: ComponentFixture<AdminUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
