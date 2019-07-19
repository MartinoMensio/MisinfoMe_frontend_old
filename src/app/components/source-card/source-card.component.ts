import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-source-card',
  templateUrl: './source-card.component.html',
  styleUrls: ['./source-card.component.css']
})
export class SourceCardComponent implements OnInit {

  @Input()
  sourceAssessment: any;

  constructor() { }

  ngOnInit() {
  }

}
