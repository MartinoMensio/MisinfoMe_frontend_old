import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { CountResult, LoadStates, OverallCounts, APIService } from 'src/app/services/api.service';

interface CountResultWithPieData extends CountResult {
  pie_data: Array<any>;
}

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
export class HomeComponent implements OnInit, OnDestroy {

  state_screen_name: string; // the value that comes from the url parameter
  screen_name = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+')]);
  score: number;

  score_pos: number;
  score_neg: number;
  score_unk: number;
  tweet_cnt: number;
  use_credibility: FormControl = new FormControl(false);

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  colorSchemeLinear = {
    domain: ['#A10A28', '#C7B42C', '#5AA454']
  };

  result_you: CountResult;

  // state management
  loadStates = LoadStates;
  main_profile_state = LoadStates.None; // for show_you, loading_you, error_you
  error_detail_profile: string;
  overall_state = LoadStates.None; // for (if result_overall), loading_overall, error_overall
  error_detail_overall: string;

  pie_data_overall = [];
  result_overall: OverallCounts;

  loading_friends: Boolean = false;
  friends_count: number;
  friends_screen_names: {}; // a dict {'screen_name': analysed(Boolean)}
  friends_analysis_show: Boolean = false;
  pie_data_friends: any[];
  result_friends: OverallCounts;
  friends_results: Array<CountResultWithPieData>;
  friends_results_sorted: Array<CountResultWithPieData>;
  max_worst = 10;
  _chosen_criterion = 'bad_cnt';
  loading_str: '';
  get chosen_criterion() {
    return this._chosen_criterion;
  }
  set chosen_criterion(chosen_criterion) {
    this._chosen_criterion = chosen_criterion;
    this.friends_results_sorted = this.sort_friends();
  }
  sorting_criteria = [{
    'value': 'bad_cnt',
    'name': 'Number of misinforming URLs shared'
  }, /*{ // TODO the bad links count twice or trice
    'value': 'score',
    'name': 'Worst score first, if equal sort by descending count of misinforming URLs'
  },*/ {
    'value': 'bad_percentage',
    'name': 'Percentage of misinforming URLs'
  }
  ];

  // best_friend: CountResult;
  // best_friend_pie_data = [];
  worst_friend: CountResult;
  worst_friend_pie_data = [];


  you_vs_average = [];
  you_vs_average_multi = [];


  private sub: Subscription;

  constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.state_screen_name = params['screen_name'];
      this.screen_name.setValue(params['screen_name']);
      console.log('sub called ' + this.screen_name.value);
      if (this.screen_name.value) {
        this.analyse();
      }
    });
    this.update_overall();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  formatPercent(val) {
    return val + '%';
  }



  getErrorMessage() {
    if (this.screen_name.hasError('required')) {
      return 'Screen name is required';
    } else if (this.screen_name.hasError('pattern')) {
      return 'Invalid screen name. It can only contain letters and numbers';
    } else {
      console.log(this.screen_name.errors);
      return 'Invalid';
    }
  }

  update_overall() {
    this.overall_state = LoadStates.Loading;
    return this.apiService.getOverallCounts().subscribe((results: OverallCounts) => {
      this.result_overall = results;
      this.pie_data_overall = this.extract_results(results);
      this.overall_state = LoadStates.Loaded;
    }, (error) => {
      console.log(error);
      this.overall_state = LoadStates.Error;
      this.error_detail_overall = error.error.detail;
    });
  }

  private default_pie_data() {
    return this.extract_results({
      verified_urls_cnt: 0,
      fake_urls_cnt: 0,
      mixed_urls_cnt: 0,
      unknown_urls_cnt: 0
    });
  }

  private extract_results(json_data: any) {
    return [{
      name: 'Valid',
      value: json_data.verified_urls_cnt
    }, {
      name: 'Misinformation',
      value: json_data.fake_urls_cnt
    }, {
      name: 'Mixed',
      value: json_data.mixed_urls_cnt
    }, {
      name: 'Unknown',
      value: json_data.unknown_urls_cnt
    }];
  }

  onSubmit() {
    console.log('submit with ' + this.screen_name.value, ' from ' + this.state_screen_name);
    if (this.state_screen_name !== this.screen_name.value) {
      return this.router.navigate(['/analyse', this.screen_name.value]);
    } else {
      // reload current page
      return this.ngOnInit();
    }
  }

  analyse() {
    this.main_profile_state = LoadStates.Loading;
    console.log('clicked!!!');
    this.apiService.postUserCountWithUpdates(this.screen_name.value, this.use_credibility.value).pipe(
      map(result_update => {
        console.log(result_update);
        // update the message
        this.loading_str = result_update.state;
        return result_update;
      }),
      // wait until success
      first((res: any) => res.state === 'SUCCESS'),
      // then unwrap the result
      map((result_ok: any) => result_ok.result)
    ).subscribe((result: CountResult) => {
      this.result_you = result;
      this.loading_str = '';

      this.update_overall().add(something => {

        this.you_vs_average = [
          {
            'name': this.state_screen_name,
            'value': result.score
          },
          {
            'name': 'Average',
            'value': this.result_overall.score
          }
        ];

        this.you_vs_average_multi = [
          {
            name: this.state_screen_name,
            series: [
              {
                name: 'Valid',
                value: result.verified_urls_cnt
              }, {
                name: 'Misinformation',
                value: result.fake_urls_cnt
              }, {
                name: 'Mixed',
                value: result.mixed_urls_cnt
              }, {
                name: 'Unknown',
                value: result.unknown_urls_cnt
              }
            ]
          }, {
            name: 'Average',
            series: [
              {
                name: 'Valid',
                value: this.result_overall.verified_urls_cnt / this.result_overall.twitter_profiles_cnt
              }, {
                name: 'Misinformation',
                value: this.result_overall.fake_urls_cnt / this.result_overall.twitter_profiles_cnt
              }, {
                name: 'Mixed',
                value: this.result_overall.mixed_urls_cnt / this.result_overall.twitter_profiles_cnt
              }, {
                name: 'Unknown',
                value: this.result_overall.unknown_urls_cnt / this.result_overall.twitter_profiles_cnt
              }
            ]
          }
        ];
      });
      this.friends_analysis_show = false;
      this.result_friends = this.get_resetted_counts();
      this.friends_results = [];
      this.friends_results_sorted = [];
      this.pie_data_friends = this.default_pie_data();
      this.get_friends_list(this.screen_name.value);

      this.main_profile_state = LoadStates.Loaded;
    }, (error) => {
      console.log(error);
      this.main_profile_state = LoadStates.Error;
      this.error_detail_profile = error.error.detail;
    });
  }

  get_friends_list(screen_name) {
    this.loading_friends = true;
    // this.apiService.getFriendsCount(screen_name).subscribe((friends: Array<any>) => {
    //   // best and worst
    //   // this.best_friend = null;
    //   this.worst_friend = null;

    //   const friends_screen_names = friends.reduce((acc, curr) => {
    //     acc.push(curr.screen_name);
    //     return acc;
    //   }, []);
    //   this.friends_screen_names = {};
    //   this.friends_count = friends_screen_names.length;
    //   this.friends_analysis_show = false;
    //   this.friends_graph = this.generateGraph(this.result_you, []);

    //   friends.forEach((el: CountResult) => {
    //     if (el.cache === 'miss') {
    //       // this is a cache miss, profile not yet evaluated
    //       this.friends_screen_names[el.screen_name] = false;
    //     } else {
    //       // cache hit
    //       this.friends_screen_names[el.screen_name] = true;
    //       //this.update_friends_stat_with_new(el);
    //     }
    //   });
    //   if (this.result_friends.twitter_profiles_cnt < this.friends_count) {
    //     this.analyse_remaining_disabled = false;
    //   }
    //   this.friends_graph.trick(this.friends_graph);
    //   this.loading_friends = false;
    //   this.friends_analysis_show = true;
    // });
  }

  // updateFriends(event: Array<CountResult>) {
  //   this.friends_results = event;
  // }

  update_friends_stat_with_new(friend: CountResult) {
    this.result_friends.tweets_cnt += friend.tweets_cnt;
    this.result_friends.shared_urls_cnt += friend.shared_urls_cnt;
    this.result_friends.fake_urls_cnt += friend.fake_urls_cnt;
    this.result_friends.verified_urls_cnt += friend.verified_urls_cnt;
    this.result_friends.mixed_urls_cnt += friend.mixed_urls_cnt;
    this.result_friends.unknown_urls_cnt += friend.unknown_urls_cnt;
    this.result_friends.twitter_profiles_cnt++;
    this.pie_data_friends = this.extract_results(this.result_friends);

    this.friends_analysis_show = true;


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
    // this.best_friend_pie_data = this.extract_results(this.best_friend);
    this.worst_friend_pie_data = this.extract_results(this.worst_friend);

    this.friends_results.push({
      ...friend, pie_data: this.extract_results(friend)
    });
    this.friends_results_sorted = this.sort_friends();
  }

  sort_friends() {
    return this.friends_results.sort((a, b) => {
      const score_diff = a.score - b.score;
      const fake_cnt_diff = b.fake_urls_cnt - a.fake_urls_cnt;
      const perc_fake_diff = (100 * b.fake_urls_cnt) / b.shared_urls_cnt - (100 * a.fake_urls_cnt) / a.shared_urls_cnt;
      switch (this.chosen_criterion) {
        case 'bad_cnt':
          return b.fake_urls_cnt - a.fake_urls_cnt;
        case 'score':
          if (Math.abs(score_diff) > 0.01) {
            return score_diff;
          } else {
            return fake_cnt_diff;
          }
        case 'bad_percentage':
          if (Math.abs(perc_fake_diff) > 0.01) {
            return perc_fake_diff;
          } else {
            return fake_cnt_diff;
          }
      }
    });
  }

  get_resetted_counts(): OverallCounts {
    return {
      screen_name: '',
      profile_image_url: '',
      score: -1,
      tweets_cnt: 0,
      shared_urls_cnt: 0,
      fake_urls_cnt: 0,
      unknown_urls_cnt: 0,
      verified_urls_cnt: 0,
      mixed_urls_cnt: 0,
      fake_urls: [],
      verified_urls: [],
      mixed_urls: [],
      rebuttals: [],
      twitter_profiles_cnt: 0
    };
  }




  getColor(counts: CountResult) {
    if (counts.score > 50) {
      return 'rgb(90, 164, 84)';
    } else if (counts.score < 50) {
      return 'rgb(161, 10, 40)';
    } else {
      return 'grey';
    }
  }

  getGraphHeight() {
    // a proportional value to the friends, between the two extremes
    const min_height = 300;
    const max_height = 1000;
    const max_friends = 500;
    return min_height + (this.result_friends.twitter_profiles_cnt) * (max_height - min_height) / max_friends;
  }

}
