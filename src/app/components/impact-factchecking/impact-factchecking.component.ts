import { Component, OnInit } from '@angular/core';
import { APIService } from '../../api.service';
import { select } from 'd3';

export interface Food {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-impact-factchecking',
  templateUrl: './impact-factchecking.component.html',
  styleUrls: ['./impact-factchecking.component.css']
})
export class ImpactFactcheckingComponent implements OnInit {
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  schemeType = 'ordinal';

  factchecking_by_domain: any;
  labels = ['all', 'fake', 'true', 'mixed', 'unknown'];
  time_granularities = ['month', 'year'];
  _selected_time_granularity = 'month';
  set selected_time_granularity(time_granularity) {
    this._selected_time_granularity = time_granularity;
    this.update_time_plot();
  }
  get selected_time_granularity() {
    return this._selected_time_granularity;
  }
  time_modes = ['absolute', 'relative'];
  selected_time_mode = 'absolute';
  private _selected_factchecker_str = 'snopes.com';
  selected_factchecker_obj = null;
  all_factcheckers_data: any;
  graph_data_count_url: any;
  graph_data_share_counts: any;
  sharing_data: any;
  list_debunking: any[];
  time_graph_data = []
    set selected_factchecker_str(selected_factchecker_str) {
    this._selected_factchecker_str = selected_factchecker_str;
    this.selected_factchecker_obj = this.all_factcheckers_data[selected_factchecker_str];
    this.graph_data_count_url = [{
      'name': 'Fact checking articles',
      'value': this.selected_factchecker_obj.urls_cnt
    }, {
      'name': 'Fact-checked articles',
      'value': this.selected_factchecker_obj.claim_urls_cnt
    }];
    console.log(this.graph_data_count_url);

    // get share counts
    this.apiService.getFactcheckingShareByDomain(selected_factchecker_str).subscribe((result) => {
      this.sharing_data = result;
      this.graph_data_share_counts = [{
        'name': 'Tweets sharing the fact checking articles',
        'value': this.sharing_data.counts.factchecking_shares_count
      }, {
        'name': 'Tweets sharing the claim URLs',
        'value': this.sharing_data.counts.claims_shares_count
      }];
      console.log(this.graph_data_share_counts);
      this.list_debunking = this.sharing_data.by_url.sort((el1, el2) => {
        return el2.factchecking_shares - el1.factchecking_shares;
      });
      // add to the time distribution
      this.update_time_plot();
    });
  }

  update_time_plot() {
    this.time_graph_data = []
      this.apiService.getTimeDistribution(this.sharing_data.tweet_ids.sharing_claim, this.selected_time_granularity).subscribe((result_times: Array<any>) => {
        // clone array because the graph does not refresh
        this.time_graph_data = Object.assign([], this.time_graph_data);
        this.time_graph_data.push({
          'name': 'Claim',
          'series': result_times
        });
      });
      this.apiService.getTimeDistribution(this.sharing_data.tweet_ids.sharing_factchecking, this.selected_time_granularity).subscribe((result_times: Array<any>) => {
        // clone array because the graph does not refresh
        this.time_graph_data = Object.assign([], this.time_graph_data);
        this.time_graph_data.push({
          'name': 'Factchecking',
          'series': result_times
        });
      });
  }

  get selected_factchecker_str() {
    return this._selected_factchecker_str;
  }
  selected_label = 'all';

  url_counts_single = [] // TODO

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getAllFactcheckingByDomain().subscribe(result => {
      this.all_factcheckers_data = result;
      this.factchecking_by_domain = Object.keys(result).reduce((acc, curr) => {
        acc.push({ 'domain': curr });
        return acc;
      }, []);
      console.log(this.factchecking_by_domain);
      this.selected_factchecker_str = this._selected_factchecker_str;
    });
  }

}
