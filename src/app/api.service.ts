import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface CountResult {
  screen_name: string;
  fake_urls_cnt: number;
  score: number;
  shared_urls_cnt: number;
  tweets_cnt: number;
  unknown_urls_cnt: number;
  verified_urls_cnt: number;
  fake_urls: Array<any>;
  verified_urls: Array<any>;
  rebuttals: object;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {
  // API_URL = 'http://localhost:5000';
  API_URL = 'https://misinformedme_backend.serveo.net';
  constructor(private httpClient: HttpClient) { }

  getSomething() {
    return this.httpClient.get(`${this.API_URL}/`);
  }

  getEvaluation(resource_path) {
    return this.httpClient.get(`${this.API_URL}/${resource_path}`);
  }

  getStats() {
    return this.httpClient.get(`${this.API_URL}/about`);
  }

}
