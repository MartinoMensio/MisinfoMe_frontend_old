import { Component, OnInit } from '@angular/core';
import { APIService } from '../../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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

  result_you = {};
  pie_data_you = [];
  loading_you: Boolean = false;
  show_you: Boolean = false;
  error_you: Boolean = false;

  pie_data_overall = [];
  result_overall = {};
  loading_overall: Boolean = false;
  error_overall: Boolean = false;

  you_vs_average = [];


  table_data_bad = [];
  table_data_good = [];

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.update_overall();
  }

  update_overall() {
    this.loading_overall = true;
    this.error_overall = false;
    this.apiService.getEvaluation(`count_urls/overall`).subscribe((results) => {
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

  private extract_results(json_data: any) {

    return [{
      name: 'Good',
      value: json_data.verified_urls_cnt
    }, {
      name: 'Bad',
      value: json_data.fake_urls_cnt
    }, {
      name: 'Unknown',
      value: json_data.unknown_urls_cnt
    }];
  }

  prepare_table_data(raw_urls_data: Array<any>) {
    // TODO first aggregate by tweet_id
    return raw_urls_data.reduce((acc, curr) => {
      acc.push({
        tweet_id: curr.found_in_tweet,
        urls: [curr._id],
        reason: curr.reason,
        dataset_names: curr.score.sources
      });
      return acc;
    }, []);
  }

  onSubmit() {
    this.show_you = true;
    this.loading_you = true;
    this.error_you = false;
    console.log('clicked!!!');
    this.apiService.getEvaluation(`count_urls/users?handle=${this.screen_name}`).subscribe((results: any) => {
      this.result_you = results;
      this.pie_data_you = this.extract_results(results);

      this.table_data_bad = this.prepare_table_data(results.fake_urls);
      this.table_data_good = this.prepare_table_data(results.verified_urls);

      this.update_overall();

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

    }, (error) => {
      console.log(error);
      this.error_you = true;
    }).add(() => {
      this.loading_you = false;
    });
  }
}
