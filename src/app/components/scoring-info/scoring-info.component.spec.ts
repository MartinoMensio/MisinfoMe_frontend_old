import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScoringInfoComponent } from './scoring-info.component';

describe('ScoringInfoComponent', () => {
  let component: ScoringInfoComponent;
  let fixture: ComponentFixture<ScoringInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoringInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoringInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
