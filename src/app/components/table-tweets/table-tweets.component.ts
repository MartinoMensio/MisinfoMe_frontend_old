import { Component, OnInit, Input } from '@angular/core';

interface TableTweetData {
  tweet_id: number;
  urls: Array<string>;
  domain?: Array<string>;
  reason: string;
  dataset_names: Array<string>;
  rebuttals?: Array<any>;
}

@Component({
  selector: 'app-table-tweets',
  templateUrl: './table-tweets.component.html',
  styleUrls: ['./table-tweets.component.css']
})
export class TableTweetsComponent implements OnInit {

  private _data: Array<TableTweetData>;
  private _visualised: number;
  private _step = 10;
  @Input()
  set data(data) {
    this._data = data;
    this.scrolled_data = data.slice(0, this._step);
    this._visualised = this._step;
  }
  get data() {
    return this._data;
  }
  scrolled_data: Array<TableTweetData> = [];

  displayedColumns: Array<String> = ['tweet_text', 'reason', 'dataset_names'];

  constructor() { }

  ngOnInit() {
  }

  onScrollDown() {
    // TODO investigate why this is not called more than once
    console.log('scrolled');
    if (this._visualised >= this.data.length) {
      return;
    }
    const to_add = this._data.slice(this._visualised, this._visualised + this._step);
    const new_array = [];
    new_array.push(...this.scrolled_data);
    new_array.push(...to_add);
    this._visualised += this._step;
    this.scrolled_data = new_array;
  }

  get_friendly_reason(description_label, label) {
    switch (description_label) {
      case 'full_url_match':
        if (label === 'fake') {
          return 'matched a URL that has been marked as fake';
        } else if (label === 'mixed') {
          return 'matched a URL that has been marked as mixed';
        } else {
          return 'matched a URL that has been marked as true';
        }
      case 'domain_match':
        if (label === 'fake') {
          return 'comes from a domain with a negative credibility score';
        } else if (label === 'mixed') {
          return 'comes from a domain with a mixed credibility score';
        } else {
          return 'comes from a domain with a positive credibility score';
        }
      case 'fact_checker':
        if (label === 'fake') {
          return 'comes from a fact checker that is known to provide misinforming content';
        } else if (label === 'mixed') {
          return 'comes from a fact checker that is known to provide mixed content';
        } else {
          return 'comes from a verified fact checker';
        }
      case 'fact_checking':
        if (label === 'fake') {
          return 'has been recognised as "fake" by a recognised fact-checking organisation';
        } else if (label === 'mixed') {
          return 'has been marked as "mixed" by a recognised fact-checking organisation';
        } else {
          return 'has been verified by a recognised fact-checking organisation';
        }
      case 'rebuttal_match':
        return 'has been marked as controversial';
    }
  }

}
