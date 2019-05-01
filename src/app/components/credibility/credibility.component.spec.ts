import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredibilityComponent } from './credibility.component';

describe('CredibilityComponent', () => {
  let component: CredibilityComponent;
  let fixture: ComponentFixture<CredibilityComponent>;

  beforeEach(async(() => {
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
