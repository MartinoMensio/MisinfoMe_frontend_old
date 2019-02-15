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

  @Input()
  data: Array<TableTweetData>;

  displayedColumns: Array<String> = ['tweet_text', 'reason', 'dataset_names'];

  constructor() { }

  ngOnInit() {
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
          return 'comes from a domain that is known to provide misinforming content';
        } else if (label === 'mixed') {
          return 'comes from a domain that is known to provide mixed content';
        } else {
          return 'comes from a domain that is known to provide verified content';
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
