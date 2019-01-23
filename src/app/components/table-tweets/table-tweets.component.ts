import { Component, OnInit, Input } from '@angular/core';

interface TableTweetData {
  tweet_id: number,
  urls: Array<string>,
  domains?: Array<string>,
  reason: string,
  dataset_names: Array<string>
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

}
