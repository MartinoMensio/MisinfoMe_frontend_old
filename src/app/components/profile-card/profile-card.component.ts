import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  @Input()
  screen_name: string;

  _profileAssessment: any;
  @Input()
  set profileAssessment(profileAssessment) {
    this._profileAssessment = profileAssessment;
    this.profileAssessment.urls_credibility.assessments = this.profileAssessment.urls_credibility.assessments.sort((e1, e2) => {
      // (e2.credibility.confidence - e1.credibility.confidence) +
      return (e1.credibility.value - e2.credibility.value);
    });
    this.profileAssessment.sources_credibility.assessments = this.profileAssessment.sources_credibility.assessments.sort((e1, e2) => {
      // (e2.credibility.confidence - e1.credibility.confidence) +
      return (e1.credibility.value - e2.credibility.value);
    });
  }
  get profileAssessment() {
    return this._profileAssessment;
  }

  constructor() { }

  ngOnInit() {
  }

}
