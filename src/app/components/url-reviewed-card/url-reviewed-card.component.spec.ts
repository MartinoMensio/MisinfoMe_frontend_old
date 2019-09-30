import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlReviewedCardComponent } from './url-reviewed-card.component';

describe('UrlReviewedCardComponent', () => {
  let component: UrlReviewedCardComponent;
  let fixture: ComponentFixture<UrlReviewedCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlReviewedCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlReviewedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
