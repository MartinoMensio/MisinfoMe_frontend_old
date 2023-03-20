import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CredibilityComponent } from './credibility.component';

describe('CredibilityComponent', () => {
  let component: CredibilityComponent;
  let fixture: ComponentFixture<CredibilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CredibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
