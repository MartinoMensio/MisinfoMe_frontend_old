import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as $ from 'jquery';

@Component({
  selector: 'app-tweets-list',
  templateUrl: './tweets-list.component.html',
  styleUrls: ['./tweets-list.component.css']
})
export class TweetsListComponent implements OnInit {

  title: string;
  tweets: Array<any>;
  tweets_loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<TweetsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.tweets = data.tweets;
      this.title = data.title;
    }


  ngOnInit() {
    this.tweets_loading = true;
    this.waitForEl('.twitter-tweet-rendered', () => {
      this.tweets_loading = false;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  waitForEl(selector, callback) {
    if ($(selector).length) {
      callback();
    } else {
      setTimeout(() => {
        this.waitForEl(selector, callback);
      }, 500);
    }
  }
}
