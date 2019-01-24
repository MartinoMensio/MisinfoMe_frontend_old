import { Component, OnInit } from '@angular/core';
import { APIService, CountResult, OverallCounts } from '../../api.service';
import { trigger, style, transition, animate, keyframes, query, stagger, state } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
        ])
      ]
    )
  ]
})
export class HomeComponent implements OnInit {

  data_for_graph = {};

  screen_name: string;
  score: number;

  score_pos: number;
  score_neg: number;
  score_unk: number;
  tweet_cnt: number;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  result_you: CountResult;
  pie_data_you = [];
  loading_you: Boolean = false;
  show_you: Boolean = false;
  error_you: Boolean = false;

  pie_data_overall = [];
  result_overall: OverallCounts;
  loading_overall: Boolean = false;
  error_overall: Boolean = false;

  analyse_friends_too: Boolean = false;
  friends_screen_names: Array<string> = [];
  friends_analysed: number;
  pie_data_friends: any[];
  result_friends: OverallCounts;


  you_vs_average = [];
  you_vs_average_multi = [];


  table_data_bad = [];
  table_data_good = [];

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.update_overall();
  }

  update_overall() {
    this.loading_overall = true;
    this.error_overall = false;
    return this.apiService.getOverallCounts().subscribe((results: OverallCounts) => {
      this.result_overall = results;
      console.log(this.result_overall);
      this.pie_data_overall = this.extract_results(results);
    }, (error) => {
      console.log(error);
      this.error_overall = true;
    }).add(() => {
      this.loading_overall = false;
    });
  }

  private default_pie_data() {
    return [{
      name: 'Valid',
      value: 0
    }, {
      name: 'Misinformation',
      value: 0
    }, {
      name: 'Not checked',
      value: 0
    }];
  }

  private extract_results(json_data: any) {

    return [{
      name: 'Valid',
      value: json_data.verified_urls_cnt
    }, {
      name: 'Misinformation',
      value: json_data.fake_urls_cnt
    }, {
      name: 'Not checked',
      value: json_data.unknown_urls_cnt
    }];
  }

  prepare_table_data(raw_urls_data: Array<any>) {
    // TODO first aggregate by tweet_id
    return raw_urls_data.reduce((acc, curr) => {
      acc.push({
        tweet_id: curr.found_in_tweet,
        tweet_text: curr.tweet_text,
        url: curr.url,
        reason: curr.reason,
        datasets: curr.sources,
        retweet: curr.retweet,
        label: curr.score.label
      });
      return acc;
    }, []);
  }

  onSubmit() {
    this.show_you = true;
    this.loading_you = true;
    this.error_you = false;
    console.log('clicked!!!');
    this.apiService.getUserCounts(this.screen_name).subscribe((results: CountResult) => {
      this.result_you = results;
      this.pie_data_you = this.extract_results(results);

      this.table_data_bad = this.prepare_table_data(results.fake_urls);
      this.table_data_good = this.prepare_table_data(results.verified_urls);

      this.update_overall().add(something => {

        this.you_vs_average = [
          {
            'name': 'You',
            'value': results.score
          },
          {
            'name': 'Average',
            'value': this.result_overall.score
          }
        ];

        this.you_vs_average_multi = [
          {
            name: 'You',
            series: [
              {
                name: 'Valid',
                value: results.verified_urls_cnt
              }, {
                name: 'Misinformation',
                value: results.fake_urls_cnt
              }, {
                name: 'Not checked',
                value: results.unknown_urls_cnt
              }
            ]
          }, {
            name: 'Overall',
            series: [
              {
                name: 'Valid',
                value: this.result_overall.verified_urls_cnt
              }, {
                name: 'Misinformation',
                value: this.result_overall.fake_urls_cnt
              }, {
                name: 'Not checked',
                value: this.result_overall.unknown_urls_cnt
              }
            ]
          }
        ];
      });
      if (this.analyse_friends_too) {
        this.update_friends();
      }
    }, (error) => {
      console.log(error);
      this.error_you = true;
    }).add(() => {
      this.loading_you = false;
    });
  }

  update_friends() {
    this.apiService.getFriends(this.screen_name).subscribe((friends_screen_names: Array<string>) => {
      this.friends_screen_names = friends_screen_names;
      this.friends_analysed = 0;
      this.result_friends = {
        screen_name: '',
        score: -1,
        tweets_cnt: 0,
        shared_urls_cnt: 0,
        fake_urls_cnt: 0,
        unknown_urls_cnt: 0,
        verified_urls_cnt: 0,
        fake_urls: [],
        verified_urls: [],
        rebuttals: [],
        twitter_profiles_cnt: 0
      };
      this.pie_data_friends = this.default_pie_data();
      friends_screen_names.forEach((el: string) => {
        this.apiService.getUserCounts(el, true).subscribe((results: CountResult) => {
          this.friends_analysed++;
          this.result_friends.tweets_cnt += results.tweets_cnt;
          this.result_friends.shared_urls_cnt += results.shared_urls_cnt;
          this.result_friends.fake_urls_cnt += results.fake_urls_cnt;
          this.result_friends.unknown_urls_cnt += results.unknown_urls_cnt;
          this.result_friends.verified_urls_cnt += results.verified_urls_cnt;
          this.result_friends.twitter_profiles_cnt++;
          this.pie_data_friends = this.extract_results(this.result_friends);

          if (this.result_friends.twitter_profiles_cnt % 50 === 0) {
            // update sometimes
            this.update_overall();
          }
        });
      });
      this.update_overall();
    });
  }
}
