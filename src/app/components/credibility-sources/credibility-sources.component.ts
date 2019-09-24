import { Component, OnInit } from '@angular/core';
import { APIService, CountResult, OverallCounts, LoadStates } from '../../api.service';
import { forceManyBody, forceCollide, forceX, forceY, forceLink, forceSimulation } from 'd3-force';
import * as shape from 'd3-shape';
import * as $ from 'jquery';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credibility-sources',
  templateUrl: './credibility-sources.component.html',
  styleUrls: ['./credibility-sources.component.css']
})
export class CredibilitySourcesComponent implements OnInit {

  state_source: string; // the value that comes from the url parameter
  source = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_.-]+')]);
  private source_prefix = '';
  private sub: Subscription;

  // state management
  loadStates = LoadStates;
  source_loading_state = LoadStates.None;
  error_detail_source: string;

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
    const final_value = this.source_prefix + this.source.value;
    console.log('submit with ' + final_value, ' from ' + this.state_source);
    if (this.state_source !== this.source.value) {
      return this.router.navigate(['/credibility/sources', final_value]);
    } else {
      // reload current page
      return this.ngOnInit();
    }
  }

  analyse() {
    const domain = this.state_source;
    this.source_loading_state = LoadStates.Loading;
    this.apiService.getSourceCredibility(domain).subscribe(result => {
      console.log(result);
      this.analysis_result = result;
      this.source_loading_state = LoadStates.Loaded;
    }, (error) => {
      this.source_loading_state = LoadStates.Error;
    });
  }

}
