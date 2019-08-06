import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentdetailsPage } from './documentdetails.page';

describe('DocumentdetailsPage', () => {
  let component: DocumentdetailsPage;
  let fixture: ComponentFixture<DocumentdetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentdetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentdetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
