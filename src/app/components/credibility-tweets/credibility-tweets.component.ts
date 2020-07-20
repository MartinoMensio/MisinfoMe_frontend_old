import { Component, OnInit } from '@angular/core';
import { APIService, LoadStates } from 'src/app/services/api.service';
import { Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SourceCardComponent } from '../source-card/source-card.component';

@Component({
  selector: 'app-credibility-tweets',
  templateUrl: './credibility-tweets.component.html',
  styleUrls: ['./credibility-tweets.component.css']
})
export class CredibilityTweetsComponent implements OnInit {

  tweetCredibility : any;
  state_tweet_id: string;
  loadStates = LoadStates;
  analysis_state = LoadStates.None;
  tweet_id = new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]);
  private sub: Subscription;

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
    this.apiService.getTweetCredibility(this.state_tweet_id).subscribe((result) => {
      console.log(result);
      this.tweetCredibility = result;
      this.analysis_state = LoadStates.Loaded;
    })
  }

  openSourceDialog(): void {
    const dialogRef = this.dialog.open(SourceCardComponent, {
      // width: '250px',
      maxHeight: '90vh',
      data: this.tweetCredibility.profile_as_source_credibility
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The scoring dialog was closed');
    });
  }

}
