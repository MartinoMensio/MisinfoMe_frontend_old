import { Component, OnInit, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ScoringInfoComponent } from '../scoring-info/scoring-info.component';
import { SourceCardComponent } from '../source-card/source-card.component';
import { TweetsListComponent } from '../tweets-list/tweets-list.component';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  detail_panel_is_expanded: boolean;
  detail_panel: string;
  tweets_to_show: Array<any>;

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
    console.log(sourceAssessment)
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
    const title = `Tweet${(tweets.length > 1) ? 's' : ''} using ${sourceName}`
    const dialogRef = this.dialog.open(TweetsListComponent, {
      // width: '250px',
      maxHeight: '90vh',
      data: {tweets: tweets, title: title}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
