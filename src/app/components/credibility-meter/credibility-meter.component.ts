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
    const red = this._confidence_fade_to_grey(this._red_quantity(this.credibility.value), this.credibility.confidence);
    const green = this._confidence_fade_to_grey(this._green_quantity(this.credibility.value), this.credibility.confidence);
    const blue = this._confidence_fade_to_grey(0, this.credibility.confidence, true);
    const rgb_str = `rgb(${red},${green},${blue})`;
    console.log(rgb_str)
    this.thresholdConfig = {
      '-1': {'color': rgb_str}
    };
  }

  _red_quantity(credibility_value) {
    let red = 200;
    if (credibility_value > 0) {
      red = (1 - credibility_value) * 200;
    }
    return red;
  }

  _green_quantity(credibility_value) {
    let green = 200;
    if (credibility_value < 0) {
      green = (1 + credibility_value) * 200;
    }
    return green;
  }

  _confidence_fade_to_grey(value, confidence, opposite = false) {
    const uncertainty = 1 - confidence;
    if (opposite || !opposite) {
      // how far from 200
      const gap = 200 - value;
      const bonus = gap * uncertainty;
      return value + bonus;
    }
  }

}
