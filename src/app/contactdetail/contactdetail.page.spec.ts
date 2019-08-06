import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactdetailPage } from './contactdetail.page';

describe('ContactdetailPage', () => {
  let component: ContactdetailPage;
  let fixture: ComponentFixture<ContactdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactdetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
