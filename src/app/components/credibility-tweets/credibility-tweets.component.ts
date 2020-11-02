import { Component, OnInit } from '@angular/core';
import { APIService, LoadStates } from 'src/app/services/api.service';
import { Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SourceCardComponent } from '../source-card/source-card.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-credibility-tweets',
  templateUrl: './credibility-tweets.component.html',
  styleUrls: ['./credibility-tweets.component.css'],
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
export class CredibilityTweetsComponent implements OnInit {

  tweetCredibility : any;
  state_tweet_id: string;
  loadStates = LoadStates;
  analysis_state = LoadStates.None;
  tweet_id = new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]);
  private sub: Subscription;

  detail_panel: string;
  detail_panel_is_expanded: boolean;

  fact_checks = [];
  error_detail_tweet: string;

  constructor(private apiService: APIService, private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.state_tweet_id = params['tweet_id'];
      this.tweet_id.setValue(params['tweet_id']);
      console.log('sub called ' + this.tweet_id.value);
      if (this.tweet_id.value) {
        this.analyse();
      }
    });
  }

  analyse() {
    this.analysis_state = LoadStates.Loading;
    this.apiService.getTweetCredibility(this.state_tweet_id).subscribe((result: any) => {
      console.log(result);
      this.tweetCredibility = result;
      if (result.tweet_direct_credibility) {
        for (let ass of result.tweet_direct_credibility?.assessments) {
          console.log(ass);
          for (let el of ass.reports) {
            this.fact_checks.push(el);
          }
        }
      }
      if (this.tweetCredibility.ratingExplanationFormat === 'markdown') {
        // remove last bit from explaination (self referencing)
        const start = this.tweetCredibility.ratingExplanation.indexOf('For more details of this analysis')
        this.tweetCredibility.ratingExplanation = this.tweetCredibility.ratingExplanation.substr(0, start)
      }
      this.analysis_state = LoadStates.Loaded;
    }, () => {
      console.log('error');
      this.analysis_state = LoadStates.Error;
      this.error_detail_tweet = 'Tweet not found'
    })
  }

  openSourceDialog(sourceAssessment): void {
    console.log(sourceAssessment);
    const dialogRef = this.dialog.open(SourceCardComponent, {
      // width: '250px',
      maxHeight: '90vh',
      data: sourceAssessment
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The scoring dialog was closed');
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

}
