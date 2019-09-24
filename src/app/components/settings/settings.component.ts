import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  evaluation_type: string;
  credibility_meter_type: string;

  // TODO this needs to be removed, only new evaluation has sense
  evaluation_type_options = [{
    name: 'Credibility model',
    id: 'credibility'
  }, {
    name: 'Legacy model',
    id: 'legacy'
  }
  ];

  credibility_meter_type_options = [
    {
      name: 'Thumb indicator (shows a thumb going from up to down)',
      id: 'thumb'
    }, {
      name: 'Gauge indicator (shows a horizontal gauge)',
      id: 'gauge'
    }
  ];

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.evaluation_type = localStorage.getItem('evaluation_type') || 'credibility';
    this.credibility_meter_type = localStorage.getItem('credibility_meter_type') || 'thumb';
  }

  clearSettings() {
    localStorage.clear();
    this.initForm();
    this._snackBar.open('Settings have been cleared!', 'OK', {duration: 3000});
  }

  setEvaluationType(type) {
    localStorage.setItem('evaluation_type', type);
  }

  setCredibilityMeterType(type) {
    localStorage.setItem('credibility_meter_type', type);
  }

  save() {
    this.setEvaluationType(this.evaluation_type);
    this.setCredibilityMeterType(this.credibility_meter_type);
    this._snackBar.open('Settings have been saved!', 'OK', {duration: 3000});
  }

}
