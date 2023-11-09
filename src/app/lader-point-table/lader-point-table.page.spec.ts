import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaderPointTablePage } from './lader-point-table.page';

describe('LaderPointTablePage', () => {
  let component: LaderPointTablePage;
  let fixture: ComponentFixture<LaderPointTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaderPointTablePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaderPointTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
