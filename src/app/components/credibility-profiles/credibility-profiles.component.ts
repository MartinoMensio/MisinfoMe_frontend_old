import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APIService, LoadStates } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, first } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-credibility-profiles',
  templateUrl: './credibility-profiles.component.html',
  styleUrls: ['./credibility-profiles.component.css']
})
export class CredibilityProfilesComponent implements OnInit {

  state_screen_name: string; // the value that comes from the url parameter
  screen_name = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+')]);
  evaluation_type: string; // from the settings
  private sub: Subscription;
  use_credibility: FormControl = new FormControl(true);

  // state management
  loadStates = LoadStates;
  loading_str = '';
  main_profile_state = LoadStates.None;
  error_detail_profile: string;

  analysis_result: any;
  analysis_result_backward_compat: any;

  constructor(private apiService: APIService, private settingsService: SettingsService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.state_screen_name = params['screen_name'];
      this.screen_name.setValue(params['screen_name']);
      console.log('sub called ' + this.screen_name.value);
      if (this.screen_name.value) {
        this.analyse();
      }
    });
    this.evaluation_type = this.settingsService.evaluationType;
  }

  onSubmit() {
    console.log('submit with ' + this.screen_name.value, ' from ' + this.state_screen_name);
    if (this.state_screen_name !== this.screen_name.value || this.use_credibility.dirty) {
      if (this.use_credibility.value) {
        return this.router.navigate(['/credibility/profiles', this.screen_name.value]);
      } else {
        return this.router.navigate(['/analyse', this.screen_name.value]);
      }
    } else {
      // reload current page
      return this.ngOnInit();
    }
  }

  analyse() {
    const screen_name = this.state_screen_name;
    this.main_profile_state = LoadStates.Loading;
    let observable;
    console.log(this.settingsService.evaluationType);
    switch (this.settingsService.evaluationType) {
      case 'credibility':
        observable = this.apiService.getUserCredibilityWithUpdates(screen_name);
        break;
      case 'legacy':
        observable = this.apiService.postUserCountWithUpdates(screen_name);
        break;
      default:
        throw Error(`invalid setting ${this.settingsService.evaluationType}`);
    }
    observable.pipe(
      map((result_update: any) => {
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
      this.analysis_result_backward_compat = result; 
      // {
      //   screen_name: result.itemReviewed.screen_name,
      //   profile_image_url: result.itemReviewed.image_full,
      //   // score is used for the colour, TODO fix with new colour computation
      //   score: (result.credibility.value + 1) * 50
      // }
      this.loading_str = '';
      this.main_profile_state = LoadStates.Loaded;
    }, (error) => {
      this.main_profile_state = LoadStates.Error;
      this.error_detail_profile = error.error.detail;
    });
  }

  update_friends_stat_with_new(friend_analysis) {
    // TODO update friend statistics
    return;
  }

}
