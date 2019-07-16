import { Component, OnInit } from '@angular/core';
import { APIService, CountResult, OverallCounts } from '../../api.service';
import { forceManyBody, forceCollide, forceX, forceY, forceLink, forceSimulation } from 'd3-force';
import * as shape from 'd3-shape';
import * as $ from 'jquery';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credibility',
  templateUrl: './credibility.component.html',
  styleUrls: ['./credibility.component.css']
})
export class CredibilityComponent implements OnInit {

  state_source: string; // the value that comes from the url parameter
  source = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_.]+')]);
  private sub: Subscription;

  analysis_result: any;

  constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.state_source = params['source'];
      this.source.setValue(params['source']);
      console.log('sub called ' + this.source.value);
      if (this.source.value) {
        this.analyse();
      }
    });
  }

  getErrorMessage() {
    if (this.source.hasError('required')) {
      return 'Source is required';
    } else if (this.source.hasError('pattern')) {
      return 'Invalid source. It can only contain letters, numbers dots and underscore';
    } else {
      console.log(this.source.errors);
      return 'Invalid';
    }
  }

  onSubmit() {
    console.log('submit with ' + this.source.value, ' from ' + this.state_source);
    if (this.state_source !== this.source.value) {
      return this.router.navigate(['/credibility', this.source.value]);
    } else {
      // reload current page
      return this.ngOnInit();
    }
  }

  analyse() {
    const domain = this.state_source;
    this.apiService.getSourceCredibility(domain).subscribe(result => {
      console.log(result);
      this.analysis_result = result;
    });
  }

}
