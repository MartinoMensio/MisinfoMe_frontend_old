import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-source',
  templateUrl: './search-source.component.html',
  styleUrls: ['./search-source.component.css']
})
export class SearchSourceComponent implements OnInit {

  @Input()
  formField: FormControl;
  @Output()
  prefix_change = new EventEmitter<string>();

  form_prefix = '';
  example = 'snopes.com';
  types_config = {
    'webpage': {
      prefix: '',
      example: 'snopes.com'
    },
    'twitter': {
      prefix: 'twitter.com/',
      example: 'realDonaldTrump'
    },
    'facebook': {
      prefix: 'facebook.com/',
      example: 'thespiritscience'
    }
  };
  source_type: FormControl = new FormControl();

  // autocomplete
  results = [];
  isLoading = false;
  errorMsg = '';

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.source_type.valueChanges.subscribe((value) => {
      console.log(value);
      if (!(value in this.types_config)) {
        throw Error(value);
      }
      this.form_prefix = this.types_config[value].prefix;
      this.example = this.types_config[value].example;
      this.prefix_change.emit(this.form_prefix);
    });
    this.formField.valueChanges.subscribe((value: string) => {
      // this part manages the pasting and cleans up the form value
      const trimmed = (value || '').trim();
      if (trimmed !== value) {
        this.formField.setValue(trimmed);
        return;
      }
      const useless = ['https://', 'http://'];
      for (const u of useless) {
        if (value.startsWith(u)) {
          this.formField.setValue(value.replace(u, ''));
          return;
        }
      }
      // tslint:disable-next-line: forin
      for (const k in this.types_config) {
        const val = this.types_config[k];
        if (!val.prefix && this.source_type.value) {
          // the type has already been set. But allow setting to website (that does not have the prefix)
          continue;
        }
        if (value.startsWith(val.prefix)) {
          this.source_type.setValue(k);
          this.formField.setValue(value.replace(val.prefix, ''));
        }
      }
    });
    this.formField.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = '';
          this.results = [];
          this.isLoading = true;
        }),
        switchMap(value => this.httpClient.get(`https://idir.uta.edu/claimportal/api/v1/users?keyword=${value}`)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((data: Array<any>) => {
        this.errorMsg = '';
        this.results = data;

        console.log(this.results);
      });
    this.formField.setValue(this.formField.value);
  }

  getErrorMessage() {
    if (this.formField.hasError('required')) {
      return 'Source is required';
    } else if (this.formField.hasError('pattern')) {
      return 'Invalid source';
    } else {
      console.log(this.formField.errors);
      return 'Invalid';
    }
  }

}
