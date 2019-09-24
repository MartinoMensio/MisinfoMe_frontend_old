import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSourceComponent } from './search-source.component';

describe('SearchSourceComponent', () => {
  let component: SearchSourceComponent;
  let fixture: ComponentFixture<SearchSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
