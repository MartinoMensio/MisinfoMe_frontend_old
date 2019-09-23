import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APIService, LoadStates } from 'src/app/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'app-credibility-profiles',
  templateUrl: './credibility-profiles.component.html',
  styleUrls: ['./credibility-profiles.component.css']
})
export class CredibilityProfilesComponent implements OnInit {

  state_screen_name: string; // the value that comes from the url parameter
  screen_name = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+')]);
  private sub: Subscription;

  // state management
  loadStates = LoadStates;
  loading_str = '';
  main_profile_state = LoadStates.None;
  error_detail_profile: string;

  analysis_result: any;

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
  }

  onSubmit() {
    console.log('submit with ' + this.screen_name.value, ' from ' + this.state_screen_name);
    if (this.state_screen_name !== this.screen_name.value) {
      return this.router.navigate(['/credibility/profiles', this.screen_name.value]);
    } else {
      // reload current page
      return this.ngOnInit();
    }
  }

  analyse() {
    const screen_name = this.state_screen_name;
    this.main_profile_state = LoadStates.Loading;
    this.apiService.getUserCredibilityWithUpdates(screen_name).pipe(
      map(result_update => {
        console.log(result_update);
        // update the message
        this.loading_str = result_update.state;
        return result_update;
      }),
      // wait until success
      first((res: any) => res.state === 'SUCCESS'),
      // then unwrap the result
      map((result_ok: any) => result_ok.result)
    ).subscribe(result => {
      console.log(result);
      this.analysis_result = result;
      this.loading_str = '';
      this.main_profile_state = LoadStates.Loaded;
    }, (error) => {
      this.main_profile_state = LoadStates.Error;
      this.error_detail_profile = error.error.detail;
    });
  }

}
