import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonScoringComponent } from './common-scoring.component';

describe('CommonScoringComponent', () => {
  let component: CommonScoringComponent;
  let fixture: ComponentFixture<CommonScoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonScoringComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
