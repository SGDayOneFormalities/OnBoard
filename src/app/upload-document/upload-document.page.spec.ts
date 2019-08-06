import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentPage } from './upload-document.page';

describe('UploadDocumentPage', () => {
  let component: UploadDocumentPage;
  let fixture: ComponentFixture<UploadDocumentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocumentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
