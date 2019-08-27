import { Component, OnInit, Input } from '@angular/core';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.css']
})
export class SearchUserComponent implements OnInit {

  @Input()
  formField: FormControl;

  errorMsg: string;
  results: Array<any>;
  isLoading: boolean;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
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
  }

  getErrorMessage() {
    if (this.formField.hasError('required')) {
      return 'Screen name is required';
    } else if (this.formField.hasError('pattern')) {
      return 'Invalid screen name. It can only contain letters and numbers';
    } else {
      console.log(this.formField.errors);
      return 'Invalid';
    }
  }

}
