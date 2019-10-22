import { Injectable } from '@angular/core';

export class CredibilityMeterType {
  id: string;
  name: string;
  description: string;
}

export class EvaluationType {
  id: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // local storage keys for the settings
  private credibilityMeterTypeLSkey = 'credibility_meter_type';
  private evaluationTypeLSkey = 'evaluation_type';
  private showUnkownLSkey = 'show_unknown';

  // possible values
  public credibilityMeterTypes: Array<CredibilityMeterType> = [
    {
      id: 'thumb',
      name: 'Thumb indicator',
      description: 'shows a thumb going from up to down'
    }, {
      id: 'gauge',
      name: 'Gauge indicator',
      description: 'shows a horizontal gauge'
    }
  ];
  public evaluationTypes: Array<EvaluationType> = [
    {
      id: 'credibility',
      name: 'Credibility model',
      description: 'Uses  the credibility scores of the sources and URLs, aggregating existing assessments and fact-checks'
    }, {
      id: 'legacy',
      name: 'Legacy model',
      description: 'Based mainly on OpenSources and other lists'
    }
  ];

  public set showUnknown(show_unknown: boolean) {
    localStorage.setItem(this.showUnkownLSkey, show_unknown.toString());
  }

  public get showUnknown() {
    return (localStorage.getItem(this.showUnkownLSkey) || 'false') === 'true';
  }


  public set credibilityMeterType(type_id: string) {
    // saves the setting
    const match = this.credibilityMeterTypes.find((el) => el.id === type_id);
    if (!match) {
      throw Error(`${type_id} not found`);
    }
    localStorage.setItem(this.credibilityMeterTypeLSkey, type_id);
  }
  public get credibilityMeterType() {
    // gets the setting with default value
    return localStorage.getItem(this.credibilityMeterTypeLSkey) || 'thumb';
  }

  public set evaluationType(type_id: string) {
    // saves the setting
    const match = this.evaluationTypes.find((el) => el.id === type_id);
    if (!match) {
      throw Error(`${type_id} not found`);
    }
    localStorage.setItem(this.evaluationTypeLSkey, type_id);
  }
  public get evaluationType() {
    // gets the setting with default value
    return localStorage.getItem(this.evaluationTypeLSkey) || 'credibility';
  }

  constructor() { }

  clearSettings() {
    localStorage.clear();
  }

}
