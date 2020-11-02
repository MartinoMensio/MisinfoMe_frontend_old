import { Component, OnInit, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ScoringInfoComponent } from '../scoring-info/scoring-info.component';
import { SourceCardComponent } from '../source-card/source-card.component';
import { TweetsListComponent } from '../tweets-list/tweets-list.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('500ms', style({ opacity: 0 }))
        ])
      ]
    )
  ]
})
export class ProfileCardComponent implements OnInit {

  detail_panel_is_expanded: boolean;
  detail_panel: string;
  tweets_to_show: Array<any>;
  bad_sources: Array<any>;
  bad_sources_tweets: Array<string> = [];
  fact_checkers_reviewing: Set<any>;
  reports: Array<any>;
  fact_checked_positive_unique: Set<any>;
  fact_checked_negative_unique: Set<any>;

  @Input()
  screen_name: string;

  _profileAssessment: any;
  @Input()
  set profileAssessment(profileAssessment) {
    this._profileAssessment = profileAssessment;
    // sort
    this.profileAssessment.urls_credibility.assessments = this.profileAssessment.urls_credibility.assessments.sort((e1, e2) => {
      // (e2.credibility.confidence - e1.credibility.confidence) +
      return (e1.credibility.value - e2.credibility.value);
    });
    this.profileAssessment.sources_credibility.assessments = this.profileAssessment.sources_credibility.assessments.sort((e1, e2) => {
      // (e2.credibility.confidence - e1.credibility.confidence) +
      return (e1.credibility.value - e2.credibility.value);
    });
    this.bad_sources = this.profileAssessment.sources_credibility.assessments.filter((element) => {
      return element.credibility.value < 0;
    });
    for (let source_ass of this.bad_sources) {
      this.bad_sources_tweets = [...new Set([...this.bad_sources_tweets, ...source_ass.tweets_containing])];
    };
    for (let ass of this.profileAssessment.profile_as_source_credibility.assessments) {
      if (ass.origin_id === 'factchecking_report') {
        this.reports = ass.reports;
        this.fact_checked_negative_unique = new Set(
          this.reports
            .filter(el =>el.coinform_label === 'not_credible')
            .map(el => el.report_url)
        );
        this.fact_checked_positive_unique = new Set(
          this.reports
            .filter(el =>el.coinform_label === 'credibile')
            .map(el => el.report_url)
        );
        this.fact_checkers_reviewing = new Set(this.reports.map(el => el.origin?.id));
      }
    }
  }
  get profileAssessment() {
    return this._profileAssessment;
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openScoringDialog(): void {
    const dialogRef = this.dialog.open(ScoringInfoComponent, {
      // width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The scoring dialog was closed');
    });
  }

  openSourceDialog(sourceAssessment): void {
    console.log(sourceAssessment);
    const dialogRef = this.dialog.open(SourceCardComponent, {
      // width: '250px',
      maxHeight: '90vh',
      data: sourceAssessment
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The source dialog was closed');
    });
  }

  setDetailTo(detail_type) {
    if (this.detail_panel === detail_type) {
      // clicking on the same again, closes it
      this.detail_panel_is_expanded = !this.detail_panel_is_expanded;
    } else {
      this.detail_panel_is_expanded = true;
    }
    this.detail_panel = detail_type;
  }

  closeDetails() {
    this.detail_panel_is_expanded = false;
  }

  seeTweets(tweets, sourceName) {
    this.tweets_to_show = tweets;
    const title = `Tweet${(tweets.length > 1) ? 's' : ''} using ${sourceName}`;
    const dialogRef = this.dialog.open(TweetsListComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: {tweets: tweets, title: title}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
