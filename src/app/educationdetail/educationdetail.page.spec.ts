import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationdetailPage } from './educationdetail.page';

describe('EducationdetailPage', () => {
  let component: EducationdetailPage;
  let fixture: ComponentFixture<EducationdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationdetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
