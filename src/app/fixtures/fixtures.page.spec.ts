import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturesPage } from './fixtures.page';

describe('FixturesPage', () => {
  let component: FixturesPage;
  let fixture: ComponentFixture<FixturesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
