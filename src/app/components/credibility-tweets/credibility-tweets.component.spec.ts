import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredibilityTweetsComponent } from './credibility-tweets.component';

describe('CredibilityTweetsComponent', () => {
  let component: CredibilityTweetsComponent;
  let fixture: ComponentFixture<CredibilityTweetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CredibilityTweetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredibilityTweetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
