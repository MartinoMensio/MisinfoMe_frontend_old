import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTweetsComponent } from './table-tweets.component';

describe('TableTweetsComponent', () => {
  let component: TableTweetsComponent;
  let fixture: ComponentFixture<TableTweetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTweetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTweetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
