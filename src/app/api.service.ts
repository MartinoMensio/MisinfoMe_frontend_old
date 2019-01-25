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

export interface OverallCounts extends CountResult {
  twitter_profiles_cnt: number;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {
  // API_URL = 'http://localhost:5000';
  API_URL = 'https://misinformedme_backend.serveo.net';
  constructor(private httpClient: HttpClient) { }

  // generic path can be passed
  private getPath(resource_path) {
    return this.httpClient.get(`${this.API_URL}${resource_path}`);
  }

  getUserCounts(screen_name, allow_cached: Boolean = false, only_cached: Boolean = false) {
    if (allow_cached) {
      if (only_cached) {
        return this.getPath(`/count_urls/users?handle=${screen_name}&allow_cached=true&only_cached=true`);
      } else {
        return this.getPath(`/count_urls/users?handle=${screen_name}&allow_cached=true`);
      }
    } else {
      return this.getPath(`/count_urls/users?handle=${screen_name}`);
    }
  }

  getOverallCounts() {
    return this.getPath('/count_urls/overall');
  }

  getStats() {
    return this.getPath(`/about`);
  }

  getFriends(screen_name) {
    return this.getPath(`/following?handle=${screen_name}`);
  }

}
