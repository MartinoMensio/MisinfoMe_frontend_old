import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactFactcheckingComponent } from './impact-factchecking.component';

describe('ImpactFactcheckingComponent', () => {
  let component: ImpactFactcheckingComponent;
  let fixture: ComponentFixture<ImpactFactcheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpactFactcheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactFactcheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
