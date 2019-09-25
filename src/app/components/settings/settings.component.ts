import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SettingsService, EvaluationType, CredibilityMeterType } from 'src/app/services/settings.service';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  evaluation_type: string;
  credibility_meter_type: string;
  only_ifcn_factchecks: boolean;
  credibility_weights: Array<any>;

  evaluation_type_options: Array<EvaluationType>;
  credibility_meter_type_options: Array<CredibilityMeterType>;

  constructor(private _snackBar: MatSnackBar, private settingsService: SettingsService, private apiService: APIService) { }

  ngOnInit() {
    this.evaluation_type_options = this.settingsService.evaluationTypes;
    this.credibility_meter_type_options = this.settingsService.credibilityMeterTypes;
    this.only_ifcn_factchecks = true;
    this.initForm();
  }

  initForm() {
    this.evaluation_type = this.settingsService.evaluationType;
    this.credibility_meter_type = this.settingsService.credibilityMeterType;
    this.apiService.getCredibilityOrigins().subscribe((res: any) => {
      this.credibility_weights = res;
    });
  }

  clearSettings() {
    this.settingsService.clearSettings();
    this.initForm();
    this._snackBar.open('Settings have been cleared!', 'OK', {duration: 3000});
  }

  save() {
    this.settingsService.evaluationType = this.evaluation_type;
    this.settingsService.credibilityMeterType = this.credibility_meter_type;
    this._snackBar.open('Settings have been saved!', 'OK', {duration: 3000});
  }

}
