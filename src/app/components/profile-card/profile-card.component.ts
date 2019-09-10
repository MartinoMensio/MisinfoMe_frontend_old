import { Component, OnInit, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ScoringInfoComponent } from '../scoring-info/scoring-info.component';
import { SourceCardComponent } from '../source-card/source-card.component';

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

}
