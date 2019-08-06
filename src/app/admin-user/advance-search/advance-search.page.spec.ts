import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSearchPage } from './advance-search.page';

describe('AdvanceSearchPage', () => {
  let component: AdvanceSearchPage;
  let fixture: ComponentFixture<AdvanceSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
