import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredibilitySourcesComponent } from './credibility-sources.component';

describe('CredibilityComponent', () => {
  let component: CredibilitySourcesComponent;
  let fixture: ComponentFixture<CredibilitySourcesComponent>;

  beforeEach(async(() => {
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
