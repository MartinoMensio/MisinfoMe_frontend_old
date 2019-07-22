import { Component, OnInit, Input } from '@angular/core';

export interface Credibility {
  value: number;
  confidence: number;
}

@Component({
  selector: 'app-credibility-meter',
  templateUrl: './credibility-meter.component.html',
  styleUrls: ['./credibility-meter.component.css']
})
export class CredibilityMeterComponent implements OnInit {

  @Input()
  credibility: Credibility;
  @Input()
  assessmentURL: string;

  gaugeType = 'arch';
  @Input()
  size = 100;
  gaugeLabel = 'Score';
  min = -1;
  max = 1;
  gaugeAppendText = '';
  thresholdConfig: any; /*{
    '-1': {color: `rgb(255,0,0)`},
    '-0.8': {color: `rgb(204,0,0)`},
    '-0.6': {color: `rgb(153,0,0)`},
    '-0.4': {color: `rgb(102,0,0)`},
    '-0.2': {color: 'orange'},
    '0.2': {color: 'green'},
    '0.4': {color: `rgb(150,255,0)`},
    '0.6': {color: `rgb(100,255,0)`},
    '0.8': {color: `rgb(50,255,0)`},
    '1': {color: `rgb(0,255,0)`},
  };*/

  constructor() { }

  ngOnInit() {
    this.thresholdConfig = {
      '-1': {'color': `rgb(${this._red_quantity(this.credibility.value)},${this._green_quantity(this.credibility.value)},0)`}
    }
  }

  _red_quantity(credibility_value) {
    if (credibility_value > 0) {
      return (1 - credibility_value) * 200;
    }
    return 200;
  }

  _green_quantity(credibility_value) {
    if (credibility_value < 0) {
      return (1 +credibility_value) * 200;
    }
    return 200;
  }

}
