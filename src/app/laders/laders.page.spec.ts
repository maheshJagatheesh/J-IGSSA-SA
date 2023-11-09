import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LadersPage } from './laders.page';

describe('LadersPage', () => {
  let component: LadersPage;
  let fixture: ComponentFixture<LadersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LadersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LadersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
