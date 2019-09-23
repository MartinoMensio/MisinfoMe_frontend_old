import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, timer, interval, throwError } from 'rxjs';
import { switchMap, takeWhile, map, startWith, filter, first, takeUntil } from 'rxjs/operators';

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
  cache?: string;
}

export interface OverallCounts extends CountResult {
  twitter_profiles_cnt: number;
}

export enum LoadStates {
  None, Loading, Loaded, Error
}

@Injectable({
  providedIn: 'root'
})
export class APIService {
  API_URL = environment.api_url;
  CREDIBILITY_URL = environment.credibility_url;

  constructor(private httpClient: HttpClient) { }

  // generic path can be passed
  private getPath(resource_path) {
    return this.httpClient.get(`${this.API_URL}${resource_path}`);
  }

  private postPath(resource_path, content) {
    console.log(resource_path, content);
    return this.httpClient.post(`${this.API_URL}${resource_path}`, content);
  }

  // the same as postUserCounts, but is strongly suggested with a huge list of screen names to avoid deadly long URLs with get params
  postUserCount(screen_name, allow_cached: Boolean = false, only_cached: Boolean = false, limit: number = 500) {

    return this.postPath(`/analysis/twitter_accounts?screen_name=${screen_name}`, {});
  }

  getOverallCounts() {
    return this.getPath('/stats/twitter_accounts');
  }

  getStats() {
    return this.getPath(`/entities`);
  }

  getSourcesOld() {
    return this.getPath('/entities/origins');
  }

  getDomains() {
    return this.getPath('/entities/domains');
  }

  getFactCheckers() {
    return this.getPath('/entities/factcheckers_table');
  }

  getFriendsCount(screen_name, limit: number = 500) {
    if (limit) {
      return this.getPath(`/analysis/twitter_accounts?relation=friends&screen_name=${screen_name}&limit=${limit}`);
    } else {
      return this.getPath(`/analysis/twitter_accounts?relation=friends&screen_name=${screen_name}`);
    }
  }

  getAllFactcheckingByDomain() {
    return this.getPath('/factchecking_by_domain');
  }

  getFactcheckingShareByDomain(checking_domain) {
    return this.getPath(`/factchecking_by_domain?from=${checking_domain}`);
  }

  getFactcheckingByFactchecker() {
    return this.getPath(`/entities/factchecking_reviews`);
  }
  //getFactcheckingShareByFactchecker()

  getTimeDistribution(tweet_ids, time_granularity) {
    const body = {
      'tweet_ids': tweet_ids,
      'time_granularity': time_granularity
    };
    return this.postPath('/tweets_time_distrib', body);
  }

  getSourceCredibility(source) {
    return this.httpClient.get(`${this.CREDIBILITY_URL}/sources/?source=${source}`);
  }

  getCredibilityOrigins() {
    return this.httpClient.get(`${this.CREDIBILITY_URL}/origins`);
  }

  getUserCredibility(screen_name) {
    return this.httpClient.get(`${this.CREDIBILITY_URL}/users/?screen_name=${screen_name}`);
  }

  createJobCredibilityProfile(screen_name) {
    console.log(`creating job for ${screen_name}`);
    return this.httpClient.get(`${this.CREDIBILITY_URL}/users/?screen_name=${screen_name}&wait=false`);
  }
  createJobAnalysisProfile(screen_name) {
    console.log(`creating job for ${screen_name}`);
    return this.postPath(`/analysis/twitter_accounts?screen_name=${screen_name}&wait=false`, {});
  }
  getJobStatus(status_id) {
    console.log(`getting status ${status_id}`)
    return this.httpClient.get(`${this.API_URL}/jobs/status/${status_id}`);
  }
  getUserCredibilityWithUpdates(screen_name) {
    return this.keepWatchingJobStatus(this.createJobCredibilityProfile(screen_name));
  }
  postUserCountWithUpdate(screen_name, allow_cached: Boolean = false, only_cached: Boolean = false, limit: number = 500) {
    return this.keepWatchingJobStatus(this.createJobAnalysisProfile(screen_name));
  }
  private keepWatchingJobStatus(o: Observable<Object>) {
    return o.pipe(
      // switch to a new observable
      switchMap((job_create_res: any) => {
        const job_id = job_create_res.internal_task_id;
        console.log(job_id);
        // every 2 seconds
        return interval(2000)
          .pipe(
            // get the result of the job
            switchMap(() => {
              console.log('inside switchMap');
              return this.getJobStatus(job_id);
            }),
            // and keep propagating the values while it's not completed
            takeWhile((val: any) => {
              console.log('checking the status of the job');
              console.log(val.state);
              // turn the failure into an exception
              if (val.state === 'FAILURE') {
                // the subscriber will receive an error in the error subscriber
                // throwError will notify the subscribers
                throwError(val);
                throw val; // return false wasn't enough (strange EmptyErrorImpl)
                // and the interval will stop to run
              }
              return val.state !== 'SUCCESS';
            }, true) // the inclusive flag lets also the false condition to get emitted (completed)
          );
      })
    );
  }

}
