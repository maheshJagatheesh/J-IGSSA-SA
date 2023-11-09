import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EachTeamDetailPage } from './each-team-detail.page';

describe('EachTeamDetailPage', () => {
  let component: EachTeamDetailPage;
  let fixture: ComponentFixture<EachTeamDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EachTeamDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EachTeamDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
