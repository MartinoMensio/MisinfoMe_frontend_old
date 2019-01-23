import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
