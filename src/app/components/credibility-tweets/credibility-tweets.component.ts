import { Component, OnInit } from '@angular/core';
import { APIService, LoadStates } from 'src/app/services/api.service';
import { Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private apiService: APIService, private route: ActivatedRoute) { }

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

}
