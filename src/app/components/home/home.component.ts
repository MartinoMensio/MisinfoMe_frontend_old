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

  loading_friends: Boolean = false;
  friends_count: number;
  friends_screen_names: {}; // a dict {'screen_name': analysed(Boolean)}
  friends_analysis_show: Boolean = false;
  pie_data_friends: any[];
  result_friends: OverallCounts;
  analyse_remaining_disabled: Boolean = true;

  best_friend: CountResult;
  best_friend_pie_data = [];
  worst_friend: CountResult;
  worst_friend_pie_data = [];


  you_vs_average = [];
  you_vs_average_multi = [];


  table_data_bad = [];
  table_data_good = [];
  table_data_rebuttals = [];

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.update_overall();
  }

  update_overall() {
    this.loading_overall = true;
    this.error_overall = false;
    return this.apiService.getOverallCounts().subscribe((results: OverallCounts) => {
      this.result_overall = results;
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
        label: curr.score.label,
        rebuttals: curr.rebuttals
      });
      return acc;
    }, []);
  }

  onSubmit() {
    this.show_you = true;
    this.loading_you = true;
    this.error_you = false;
    console.log('clicked!!!');
    this.apiService.getUserCounts([this.screen_name]).subscribe((results: CountResult) => {
      this.result_you = results;
      this.pie_data_you = this.extract_results(results);

      this.table_data_bad = this.prepare_table_data(results.fake_urls);
      this.table_data_good = this.prepare_table_data(results.verified_urls);
      this.table_data_rebuttals = this.prepare_table_data(results.rebuttals);

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
      this.friends_analysis_show = false;
      this.result_friends = this.get_resetted_counts();
      this.pie_data_friends = this.default_pie_data();
      this.get_friends_list(this.screen_name);
    }, (error) => {
      console.log(error);
      this.error_you = true;
    }).add(() => {
      this.loading_you = false;
    });
  }

  get_friends_list(screen_name) {
    this.loading_friends = true;
    this.apiService.getFriends(screen_name).subscribe((friends_screen_names: Array<string>) => {
      // best and worst
      this.best_friend = null;
      this.worst_friend = null;

      this.friends_screen_names = {};
      this.friends_count = friends_screen_names.length;
      this.friends_analysis_show = false;
      this.apiService.getUserCounts(friends_screen_names, true, true).subscribe((res: any) => {
        Object.keys(res).forEach((el: string) => {
          if (res[el].cache === 'miss') {
            // this is a cache miss, profile not yet evaluated
            this.friends_screen_names[el] = false;
          } else {
            // cache hit
            this.friends_screen_names[el] = true;
            this.update_friends_stat_with_new(res[el]);
          }
        });
        if (this.result_friends.twitter_profiles_cnt < this.friends_count) {
          this.analyse_remaining_disabled = false;
        }
        this.loading_friends = false;
      });
    });
  }

  update_friends_stat_with_new(friend: CountResult) {
    this.result_friends.tweets_cnt += friend.tweets_cnt;
    this.result_friends.shared_urls_cnt += friend.shared_urls_cnt;
    this.result_friends.fake_urls_cnt += friend.fake_urls_cnt;
    this.result_friends.unknown_urls_cnt += friend.unknown_urls_cnt;
    this.result_friends.verified_urls_cnt += friend.verified_urls_cnt;
    this.result_friends.twitter_profiles_cnt++;
    this.pie_data_friends = this.extract_results(this.result_friends);

    this.friends_analysis_show = true;

    // check best and worse
    if (!this.best_friend) {
      this.best_friend = friend;
    }
    // first compare the score, then if equal the comparison is on the number of fake urls shared
    if (friend.score > this.best_friend.score) {
      this.best_friend = friend;
    } else if (friend.score === this.best_friend.score) {
      if (friend.fake_urls_cnt < this.best_friend.fake_urls_cnt) {
        this.best_friend = friend;
      } else if (friend.fake_urls_cnt === this.best_friend.fake_urls_cnt) {
        if (friend.verified_urls_cnt > this.best_friend.verified_urls_cnt) {
          this.best_friend = friend;
        }
      }
    }
    if (!this.worst_friend) {
      this.worst_friend = friend;
    }
    if (friend.score < this.worst_friend.score) {
      this.worst_friend = friend;
    } else if (friend.score === this.worst_friend.score) {
      if (friend.fake_urls_cnt > this.worst_friend.fake_urls_cnt) {
        this.worst_friend = friend;
      }
    }
    this.best_friend_pie_data = this.extract_results(this.best_friend);
    this.worst_friend_pie_data = this.extract_results(this.worst_friend);
  }

  get_resetted_counts(): OverallCounts {
    return {
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
  }

  analyse_remaining() {
    this.analyse_remaining_disabled = true;
    Object.keys(this.friends_screen_names).forEach((el: string) => {
      if (!this.friends_screen_names[el]) {
        // not already analysed
        // TODO manage wait observable call
        this.apiService.getUserCounts([el], true).subscribe((results: CountResult) => {
          this.update_friends_stat_with_new(results);
          if (this.result_friends.twitter_profiles_cnt % 10 === 0) {
            // update sometimes
            this.update_overall();
          }
        });
      }
    });
    this.update_overall();
  }
}
