import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { AddPage } from './add.page';

describe('AddPage', () => {
  let component: AddPage;
  let fixture: ComponentFixture<AddPage>;
  let addPage: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(async () => {
    fixture = await TestBed.createComponent(AddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of 10 elements', () => {
    addPage = fixture.nativeElement;
    const items = addPage.querySelectorAll('ion-item');
    expect(items.length).toEqual(10);
  });

});
