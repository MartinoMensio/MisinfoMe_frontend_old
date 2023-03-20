import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LegacyAnalysisComponent } from './legacy-analysis.component';

describe('LegacyAnalysisComponent', () => {
  let component: LegacyAnalysisComponent;
  let fixture: ComponentFixture<LegacyAnalysisComponent>;

  beforeEach(waitForAsync(() => {
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
