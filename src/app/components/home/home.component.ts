import { Component, OnInit, OnDestroy } from '@angular/core';
import { APIService, CountResult, OverallCounts } from '../../api.service';
import { trigger, style, transition, animate, keyframes, query, stagger, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { forceManyBody, forceCollide, forceX, forceY, forceLink, forceSimulation } from 'd3-force';
import * as $ from 'jquery';

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
  screen_name = new FormControl('');
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
  friends_results: Array<CountResultWithPieData>;
  friends_results_sorted: Array<CountResultWithPieData>;
  max_worst = 10;
  _chosen_criterion = 'bad_percentage';
  get chosen_criterion() {
    return this._chosen_criterion;
  }
  set chosen_criterion(chosen_criterion) {
    this._chosen_criterion = chosen_criterion;
    this.friends_results_sorted = this.sort_friends()
  }
  sorting_criteria = [{
    'value': 'bad_cnt',
    'name': 'Descending count of misinforming URLs'
  }, {
    'value': 'score',
    'name': 'Worst score first, if equal sort by descending count of misinforming URLs'
  }, {
    'value': 'bad_percentage',
    'name': 'Highest percentage of misinforming URLs'
  }
  ];
  analyse_remaining_disabled: Boolean = true;

  friends_graph: { links: any[]; nodes: any[]; trick: any; update_trick_ticks: number };
  graph_force = forceSimulation<any>()
    .force('charge', forceManyBody().strength(-600)) // repulsion of the nodes
    .force('x', forceX()) // make them go to the center
    .force('y', forceY())
    .alphaDecay(0.1); // decay bigger so stop faster
  // .force('collide', forceCollide(30))
  graph_force_link = forceLink<any, any>().distance(100).id(node => node.value); // the desired length of the links

  // best_friend: CountResult;
  // best_friend_pie_data = [];
  worst_friend: CountResult;
  worst_friend_pie_data = [];


  you_vs_average = [];
  you_vs_average_multi = [];


  table_data_bad = [];
  table_data_mixed = [];
  table_data_good = [];
  table_data_rebuttals = [];

  options = {
    fixedDepth: true,
    disableDrag: true
  };
  list = [];

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

  group_tweets_hierarchically(tweets: Array<any>) {
    const result = tweets.reduce((acc: any, curr: any) => {
      const label = curr.score.label;
      const reason = curr.reason;
      let by_label_group = acc[label];
      if (!by_label_group) {
        // new label
        by_label_group = {};
        acc[label] = by_label_group;
      }
      let by_reason_group = by_label_group[reason];
      if (!by_reason_group) {
        // new reason
        by_reason_group = [];
        by_label_group[reason] = by_reason_group;
      }
      by_reason_group.push(curr);
      return acc;
    }, {});
    return result;
  }

  create_nested_list(grouped) {
    this.list = [{
      'id': 'fake',
      'label': 'These tweets have been identified as linked to misinforming URLs',
      'icon': 'error',
      'class': 'bad',
      'expanded': false,
      'count': 0,
      'children': [
        {
          'id': 'fact_checking',
          'label': 'Classified as "fake" by fact-checking agencies',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'domain_match',
          'label': 'Known provider of misinforming content',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'full_url_match',
          'label': 'Other datasets',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }
      ]
    }, {
      'id': 'mixed',
      'label': 'These tweets have been identified as linked to mixed URLs',
      'icon': 'error',
      'class': 'mixed',
      'expanded': false,
      'count': 0,
      'children': [
        {
          'id': 'fact_checking',
          'label': 'Classified as "mixed" by fact-checking agencies',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'domain_match',
          'label': 'Known provider of mixed content',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'full_url_match',
          'label': 'Other datasets',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }
      ]
    }, {
      'id': 'true',
      'label': 'These tweets have been identified as linked to verified URLs',
      'icon': 'check_circle',
      'class': 'good',
      'expanded': false,
      'count': 0,
      'children': [
        {
          'id': 'fact_checking',
          'label': 'Classified as "true" by fact-checking agencies',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'fact_checker',
          'label': 'URLs pointing to fact-checking agencies',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'domain_match',
          'label': 'Known provider of verified content',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'full_url_match',
          'label': 'Other datasets',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }
      ]
    }];
    Object.keys(grouped).forEach((label) => {
      const l0 = this.list.find((el) => el.id === label);
      let tot_cnt = 0;
      Object.keys(grouped[label]).forEach((reason) => {
        const l1 = l0.children.find((el) => el.id === reason);
        const tweets = grouped[label][reason];
        const prepared_table = this.prepare_table_data(tweets);
        l1.children[0]['tweets'] = prepared_table;
        l1.count = tweets.length;
        tot_cnt += tweets.length;
      });
      l0.count = tot_cnt;
    });
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
      name: 'Not checked',
      value: json_data.unknown_urls_cnt
    }];
  }

  prepare_table_data(raw_urls_data: Array<any>) {
    // TODO first aggregate by tweet_id
    return raw_urls_data.reduce((acc, curr) => {
      const fact_checked_count = curr.score.factchecking_stats && curr.score.factchecking_stats.fake && curr.score.factchecking_stats.fake.length || 0
      acc.push({
        tweet_id: curr.found_in_tweet,
        tweet_text: curr.tweet_text,
        url: curr.url,
        reason: curr.reason,
        datasets: curr.sources,
        retweet: curr.retweet,
        label: curr.score.label,
        rebuttals: curr.rebuttals,
        fact_checked_count: fact_checked_count,
        domain: curr.domain,
        fact_checking: fact_checked_count && curr.score.factchecking_stats.fake || []
      });
      return acc;
    }, []);
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
    this.show_you = true;
    this.loading_you = true;
    this.error_you = false;
    console.log('clicked!!!');
    this.apiService.postUserCounts([this.screen_name.value]).subscribe((results: Array<CountResult>) => {
      const result = results[0];
      this.result_you = result;
      this.pie_data_you = this.extract_results(result);

      this.table_data_bad = this.prepare_table_data(result.fake_urls);
      this.table_data_mixed = this.prepare_table_data(result.mixed_urls);
      this.table_data_good = this.prepare_table_data(result.verified_urls);
      this.table_data_rebuttals = this.prepare_table_data(result.rebuttals);

      const grouped = this.group_tweets_hierarchically(result.fake_urls.concat(result.mixed_urls).concat(result.verified_urls));
      this.create_nested_list(grouped);

      this.update_overall().add(something => {

        this.you_vs_average = [
          {
            'name': 'You',
            'value': result.score
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
                value: result.verified_urls_cnt
              }, {
                name: 'Misinformation',
                value: result.fake_urls_cnt
              }, {
                name: 'Mixed',
                value: result.mixed_urls_cnt
              }, {
                name: 'Not checked',
                value: result.unknown_urls_cnt
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
                name: 'Mixed',
                value: this.result_overall.mixed_urls_cnt
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
      this.friends_results = [];
      this.friends_results_sorted = [];
      this.pie_data_friends = this.default_pie_data();
      this.get_friends_list(this.screen_name.value);
    }, (error) => {
      console.log(error);
      this.error_you = true;
    }).add(() => {
      this.loading_you = false;
    });
  }

  get_friends_list(screen_name) {
    this.loading_friends = true;
    this.apiService.getFriends(screen_name).subscribe((friends: Array<any>) => {
      // best and worst
      // this.best_friend = null;
      this.worst_friend = null;

      const friends_screen_names = friends.reduce((acc, curr) => {
        acc.push(curr.screen_name);
        return acc;
      }, []);
      this.friends_screen_names = {};
      this.friends_count = friends_screen_names.length;
      this.friends_analysis_show = false;
      this.friends_graph = this.generateGraph(this.result_you, []);
      this.apiService.getUserCounts(friends_screen_names, true, true).subscribe((res: Array<CountResult>) => {
        res.forEach((el: CountResult) => {
          if (el.cache === 'miss') {
            // this is a cache miss, profile not yet evaluated
            this.friends_screen_names[el.screen_name] = false;
          } else {
            // cache hit
            this.friends_screen_names[el.screen_name] = true;
            this.update_friends_stat_with_new(el);
          }
        });
        if (this.result_friends.twitter_profiles_cnt < this.friends_count) {
          this.analyse_remaining_disabled = false;
        }
        this.friends_graph.trick(this.friends_graph);
        this.loading_friends = false;
        this.friends_analysis_show = true;
      });
    });
  }

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

    /*
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
    */
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
    this.friends_results_sorted = this.sort_friends()
    // this.updateGraphWithFriend(this.friends_graph, this.result_you, friend);
    this.friends_graph = this.generateGraph(this.result_you, this.friends_results);
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

  analyse_remaining() {
    this.analyse_remaining_disabled = true;
    const candidate = this.get_candidate();
    this.analyse_candidate(candidate).then(res => {
      this.update_overall();
    });
    /*Object.keys(this.friends_screen_names).forEach((el: string) => {
      if (!this.friends_screen_names[el]) {
        // not already analysed
        // TODO manage wait observable call
        this.apiService.getUserCounts([el], true).subscribe((results: CountResult) => {
          this.update_friends_stat_with_new(results);
          if (this.result_friends.twitter_profiles_cnt % 10 === 0) {
            // update sometimes
            this.update_overall();
          }
          this.friends_graph.trick(this.friends_graph);
        });
      }
    });*/
  }

  get_candidate() {
    return Object.keys(this.friends_screen_names).find(el => !this.friends_screen_names[el]);
  }

  analyse_candidate(candidate: string): Promise<any> {
    if (!candidate) {
      return Promise.resolve();
    }
    return this.apiService.postUserCounts([candidate], true).toPromise().then((results: Array<CountResult>) => {
      const result = results[0]
      this.update_friends_stat_with_new(result);
      this.friends_screen_names[candidate] = true;
      if (this.result_friends.twitter_profiles_cnt % 10 === 0) {
        // update sometimes
        this.update_overall();
      }
      this.friends_graph.trick(this.friends_graph);
      const next = this.get_candidate();
      return this.analyse_candidate(next);
    }, error => {
      this.friends_screen_names[candidate] = true;
      const next = this.get_candidate();
      return this.analyse_candidate(next);
    });
  }

  updateGraphWithFriend(graph, you, friend_score) {
    graph.nodes.push({
      value: friend_score.screen_name,
      // x: -100,
      // y: 0,
      options: {
        image: friend_score.profile_image_url,
        size: 20,
        fill: this.getColor(friend_score),
        stroke: this.getColor(friend_score)
      }
    });
    graph.links.push({
      source: you.screen_name,
      target: friend_score.screen_name,
      options: {
        color: this.getColor(friend_score) + '!important'
      }
    });
  }

  generateGraph(you: CountResult, friends_scores: Array<CountResult>) {
    const graph = {
      links: [],
      nodes: [],
      overall_move_x: 20,
      overall_move_y: 20, // the whole graph is translated
      update_trick_ticks: 50,
      update_trick_interval: 100, // milliseconds
      trick: (g) => {
        // This function is needed because the ngx-charts-force-directed-graph is just animating the links and not the edges,
        // unless the mouse moves on the svg.
        // The trick is simply trigger programmatically clicks every 100ms for 5 secs on the center of the graph in order
        // to trigger the update of the position of the edges.
        setTimeout(() => {
          // console.log(`i am a trick ${g} at ${g.update_trick_ticks}`);
          g.update_trick_ticks -= 1;
          if (g.update_trick_ticks > 0) {
            g.trick(g);
            const selector = `g.nodes g`;
            // console.log(selector);
            $(selector).get(0).dispatchEvent(new Event('click'));
          }
        }, g.update_trick_interval);
      }
    };
    graph.nodes.push({
      value: you.screen_name,
      options: {
        image: you.profile_image_url,
        size: 20,
        fill: this.getColor(you),
        stroke: this.getColor(you)
      }
    });
    // console.log(friends_scores);
    for (const f of friends_scores) {
      this.updateGraphWithFriend(graph, you, f);
    }
    return graph;
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

  select_node(event: any) {
    // console.log('node selected');
    // console.log(event);
    const screen_name = event.name;
    // console.log(screen_name);
    this.friends_graph.update_trick_ticks = 0;
    this.router.navigate(['/analyse', screen_name]);
    return;
  }

}
