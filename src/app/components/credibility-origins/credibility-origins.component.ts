import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-credibility-origins',
  templateUrl: './credibility-origins.component.html',
  styleUrls: ['./credibility-origins.component.css']
})
export class CredibilityOriginsComponent implements OnInit {

  origins: Array<any>;

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getCredibilityOrigins().subscribe((result: Array<any>) => {
      this.origins = result;
    });
  }

}
