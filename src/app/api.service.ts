import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  API_URL = 'http://localhost:5000';
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

  getEvaluationFake() {
    return {
      "external_url": "100percentfedup.com",
      "reasons": [
        {
          "related_analysis": {
            "details": {
              "key": "100percentfedup.com",
              "label": "fake",
              "sources": [
                "mrisdal_fakenews",
                "opensources",
                "melissa_zimdars"
              ],
              "type": "domain_entry"
            },
            "external_url": null,
            "reasons": [],
            "related": [],
            "resource_url": "/data/datasets/domain_entry/100percentfedup.com",
            "score": {
              "value": -1.0
            },
            "type": "dataset_match"
          },
          "relationship_type": "matches",
          "type": "relationship"
        }
      ],
      "related": [],
      "resource_url": "/data/domains?domain=100percentfedup.com",
      "score": {
        "value": -1.0
      },
      "type": "domain_analysis"
    }
  }
}
