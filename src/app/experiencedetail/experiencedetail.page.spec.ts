import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperiencedetailPage } from './experiencedetail.page';

describe('ExperiencedetailPage', () => {
  let component: ExperiencedetailPage;
  let fixture: ComponentFixture<ExperiencedetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperiencedetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperiencedetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
