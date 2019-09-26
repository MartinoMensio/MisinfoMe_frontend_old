import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegacyAnalysisComponent } from './legacy-analysis.component';

describe('LegacyAnalysisComponent', () => {
  let component: LegacyAnalysisComponent;
  let fixture: ComponentFixture<LegacyAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegacyAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegacyAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
