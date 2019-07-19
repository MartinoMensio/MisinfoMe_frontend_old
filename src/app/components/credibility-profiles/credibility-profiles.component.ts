import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APIService } from 'src/app/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credibility-profiles',
  templateUrl: './credibility-profiles.component.html',
  styleUrls: ['./credibility-profiles.component.css']
})
export class CredibilityProfilesComponent implements OnInit {

  state_screen_name: string; // the value that comes from the url parameter
  screen_name = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+')]);
  private sub: Subscription;

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

  getErrorMessage() {
    if (this.screen_name.hasError('required')) {
      return 'Screen name is required';
    } else if (this.screen_name.hasError('pattern')) {
      return 'Invalid screen name. It can only contain letters and numbers';
    } else {
      console.log(this.screen_name.errors);
      return 'Invalid';
    }
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
    this.apiService.getUserCredibility(screen_name).subscribe(result => {
      console.log(result);
      this.analysis_result = result;
    });
  }

}
