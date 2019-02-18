import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface CountResult {
  screen_name: string;
  profile_image_url: string;
  fake_urls_cnt: number;
  score: number;
  shared_urls_cnt: number;
  tweets_cnt: number;
  unknown_urls_cnt: number;
  verified_urls_cnt: number;
  mixed_urls_cnt: number;
  fake_urls: Array<any>;
  verified_urls: Array<any>;
  mixed_urls: Array<any>;
  rebuttals: Array<any>;
}

export interface OverallCounts extends CountResult {
  twitter_profiles_cnt: number;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {
  API_URL = environment.api_url;

  constructor(private httpClient: HttpClient) { }

  // generic path can be passed
  private getPath(resource_path) {
    return this.httpClient.get(`${this.API_URL}${resource_path}`);
  }

  private postPath(resource_path, content) {
    console.log(resource_path, content);
    return this.httpClient.post(`${this.API_URL}${resource_path}`, content);
  }

  getUserCounts(screen_names, allow_cached: Boolean = false, only_cached: Boolean = false) {
    if (screen_names.length > 10) {
      console.log(allow_cached, only_cached);
      return this.postUserCounts(screen_names, allow_cached, only_cached);
    }
    const screen_names_joined = screen_names.join(',');
    if (allow_cached) {
      if (only_cached) {
        return this.getPath(`/count_urls/users?screen_names=${screen_names_joined}&allow_cached=true&only_cached=true`);
      } else {
        return this.getPath(`/count_urls/users?screen_names=${screen_names_joined}&allow_cached=true`);
      }
    } else {
      return this.getPath(`/count_urls/users?screen_names=${screen_names_joined}`);
    }
  }

  // the same as postUserCounts, but is strongly suggested with a huge list of screen names to avoid deadly long URLs with get params
  postUserCounts(screen_names, allow_cached: Boolean = false, only_cached: Boolean = false, limit: number = 500) {
    const json_content = {
      'screen_names': screen_names.slice(0, limit),
      'allow_cached': allow_cached,
      'only_cached': only_cached
    };
    return this.postPath(`/count_urls/users`, json_content);
  }

  getOverallCounts() {
    return this.getPath('/count_urls/overall');
  }

  getStats() {
    return this.getPath(`/about`);
  }

  getDatasets() {
    return this.getPath('/about/datasets');
  }

  getDomains() {
    return this.getPath('/about/domains');
  }

  getFactCheckers() {
    return this.getPath('/about/fact_checkers_table');
  }

  getFriends(screen_name, limit: number = 500) {
    if (limit) {
      return this.getPath(`/following?screen_name=${screen_name}&limit=${limit}`);
    } else {
      return this.getPath(`/following?screen_name=${screen_name}`);
    }
  }

}
