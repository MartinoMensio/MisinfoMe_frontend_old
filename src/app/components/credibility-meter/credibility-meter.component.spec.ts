import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredibilityMeterComponent } from './credibility-meter.component';

describe('CredibilityMeterComponent', () => {
  let component: CredibilityMeterComponent;
  let fixture: ComponentFixture<CredibilityMeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CredibilityMeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredibilityMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
