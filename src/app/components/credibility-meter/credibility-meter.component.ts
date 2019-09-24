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
  foregroundColor = 'rgba(0, 0, 0, 0.1)';
  backgroundColor = 'rgba(0, 0, 0, 0.1)';
  rgb_value = null;
  rotate_angle = 0;
  nonce = null;
  credibility_meter_type = localStorage.getItem('credibility_meter_type') || 'thumb';

  constructor() { }

  ngOnInit() {
    const red = this._confidence_fade_to_grey(this._red_quantity(this.credibility.value), this.credibility.confidence);
    const green = this._confidence_fade_to_grey(this._green_quantity(this.credibility.value), this.credibility.confidence);
    const blue = this._confidence_fade_to_grey(0, this.credibility.confidence, true);
    const rgb_str = `rgb(${red},${green},${blue})`;
    this.rgb_value = rgb_str;
    this.nonce = Math.random();
    this.rotate_angle = this.credibility.value * 90;
    console.log(rgb_str);
    if (this.credibility.value < 0) {
      this.backgroundColor = rgb_str;
    } else {
      this.foregroundColor = rgb_str;
    }
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
