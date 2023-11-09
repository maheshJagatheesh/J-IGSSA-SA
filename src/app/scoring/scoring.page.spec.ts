import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoringPage } from './scoring.page';

describe('ScoringPage', () => {
  let component: ScoringPage;
  let fixture: ComponentFixture<ScoringPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoringPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoringPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
