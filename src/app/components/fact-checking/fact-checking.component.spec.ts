import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactCheckingComponent } from './fact-checking.component';

describe('FactCheckingComponent', () => {
  let component: FactCheckingComponent;
  let fixture: ComponentFixture<FactCheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactCheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
