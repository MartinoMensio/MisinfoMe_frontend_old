import { Component, OnInit } from '@angular/core';
import { APIService } from '../../api.service';
import { GraphComponent } from "../graph/graph.component";

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
  tweet_cnt: number;


  constructor(private apiService: APIService) { }

  ngOnInit() {
  }
/*
  get_colour(score) {
    if (score > 0) {
      return `rgb(0,${Math.abs(score * 255)},0)`
    } else if (score < 0) {
      return `rgb(${Math.abs(score * 255)},0,0)`
    } else {
      return 'white'
    }
  }
*/
  loading: boolean = false

  onSubmit() {
    this.loading = true
    console.log("clicked!!!")
    this.apiService.getEvaluation(`analyse/users?screen_name=${this.screen_name}`).subscribe((results: any) => {
      this.loading = false
      this.data_for_graph = results
      this.score = results.score.value
      //this.score_rescaled = 50 + 50 * (this.score)
      const counts = results.reasons.reduce((partial, el) => {
        if (el.related_analysis.score.value > 0) {
          partial['pos']++
        } else {
          partial['neg']++
        }
        return partial
      }, {pos: 0, neg: 0})
      this.tweet_cnt = results.tweet_cnt
      this.score_pos = 100 * (counts.pos / (counts.pos + counts.neg))
      this.score_neg = 100 * (counts.neg / (counts.pos + counts.neg))
    })
  }
}
