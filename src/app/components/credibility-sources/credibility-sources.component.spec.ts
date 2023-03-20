import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CredibilitySourcesComponent } from './credibility-sources.component';

describe('CredibilityComponent', () => {
  let component: CredibilitySourcesComponent;
  let fixture: ComponentFixture<CredibilitySourcesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CredibilitySourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredibilitySourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
