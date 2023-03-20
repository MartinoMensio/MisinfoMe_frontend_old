import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CredibilityProfilesComponent } from './credibility-profiles.component';

describe('CredibilityProfileComponent', () => {
  let component: CredibilityProfilesComponent;
  let fixture: ComponentFixture<CredibilityProfilesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CredibilityProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredibilityProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
