import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredibilityOriginsComponent } from './credibility-origins.component';

describe('CredibilityOriginsComponent', () => {
  let component: CredibilityOriginsComponent;
  let fixture: ComponentFixture<CredibilityOriginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CredibilityOriginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredibilityOriginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
