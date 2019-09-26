import { Component, OnInit, Input } from '@angular/core';
import { CountResult } from 'src/app/services/api.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-legacy-analysis',
  templateUrl: './legacy-analysis.component.html',
  styleUrls: ['./legacy-analysis.component.css']
})
export class LegacyAnalysisComponent implements OnInit {

  _result_you: CountResult;
  @Input()
  set result_you(result_you) {
    this._result_you = result_you;
    this.pie_data_you = this.extract_results(result_you);
    this.table_data_bad = this.prepare_table_data(result_you.fake_urls);
    this.table_data_mixed = this.prepare_table_data(result_you.mixed_urls);
    this.table_data_good = this.prepare_table_data(result_you.verified_urls);
    this.table_data_rebuttals = this.prepare_table_data(result_you.rebuttals);

    const grouped = this.group_tweets_hierarchically(result_you.fake_urls.concat(result_you.mixed_urls).concat(result_you.verified_urls));
    this.create_nested_list(grouped);
  }
  get result_you() {
    return this._result_you;
  }


  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  options = {
    fixedDepth: true,
    disableDrag: true
  };

  pie_data_you = [];
  list = [];

  table_data_bad = [];
  table_data_mixed = [];
  table_data_good = [];
  table_data_rebuttals = [];

  // for now, the default view on the homepage is the legacy, so could be that the evaluation type is both
  // TODO remove legacy on homepage
  evaluation_type: string;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.evaluation_type = this.settingsService.evaluationType;
  }

  private extract_results(json_data: any) {
    return [{
      name: 'Valid',
      value: json_data.verified_urls_cnt
    }, {
      name: 'Misinformation',
      value: json_data.fake_urls_cnt
    }, {
      name: 'Mixed',
      value: json_data.mixed_urls_cnt
    }, {
      name: 'Unknown',
      value: json_data.unknown_urls_cnt
    }];
  }

  create_nested_list(grouped) {
    this.list = [{
      'id': 'fake',
      'label': 'These tweets have been identified as linked to misinforming URLs',
      'icon': 'error',
      'class': 'bad',
      'expanded': false,
      'count': 0,
      'children': [
        {
          'id': 'fact_checking',
          'label': 'Classified as "fake" by fact-checking agencies',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'domain_match',
          'label': 'Domain with a negative credibility score',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'full_url_match',
          'label': 'Assessments from other sources',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }
      ]
    }, {
      'id': 'mixed',
      'label': 'These tweets have been identified as linked to mixed URLs',
      'icon': 'error',
      'class': 'mixed',
      'expanded': false,
      'count': 0,
      'children': [
        {
          'id': 'fact_checking',
          'label': 'Classified as "mixed" by fact-checking agencies',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'domain_match',
          'label': 'Domain with a mixed credibility score',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'full_url_match',
          'label': 'Assessments from other sources',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }
      ]
    }, {
      'id': 'true',
      'label': 'These tweets have been identified as linked to verified URLs',
      'icon': 'check_circle',
      'class': 'good',
      'expanded': false,
      'count': 0,
      'children': [
        {
          'id': 'fact_checking',
          'label': 'Classified as "true" by fact-checking agencies',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'fact_checker',
          'label': 'URLs pointing to fact-checking agencies',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'domain_match',
          'label': 'Domain with a positive credibility score',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }, {
          'id': 'full_url_match',
          'label': 'Assessments from other sources',
          'expanded': false,
          'count': 0,
          'children': [{ 'tweets': [] }]
        }
      ]
    }];
    Object.keys(grouped).forEach((label) => {
      const l0 = this.list.find((el) => el.id === label);
      let tot_cnt = 0;
      Object.keys(grouped[label]).forEach((reason) => {
        const l1 = l0.children.find((el) => el.id === reason);
        const tweets = grouped[label][reason];
        const prepared_table = this.prepare_table_data(tweets);
        l1.children[0]['tweets'] = prepared_table;
        l1.count = tweets.length;
        tot_cnt += tweets.length;
      });
      l0.count = tot_cnt;
    });
  }

  prepare_table_data(raw_urls_data: Array<any>) {
    // TODO first aggregate by tweet_id
    return raw_urls_data.reduce((acc, curr) => {
      const fact_checked = {
        'fake': curr.score.factchecking_stats && curr.score.factchecking_stats.fake || [],
        'true': curr.score.factchecking_stats && curr.score.factchecking_stats.true || [],
        'mixed': curr.score.factchecking_stats && curr.score.factchecking_stats.mixed || [],
      };
      acc.push({
        tweet_id: curr.found_in_tweet,
        tweet_text: curr.tweet_text,
        url: curr.url,
        reason: curr.reason,
        datasets: curr.sources,
        retweet: curr.retweet,
        label: curr.score.label,
        rebuttals: curr.rebuttals,
        fact_checked: fact_checked,
        domain: curr.domain
      });
      return acc;
    }, []);
  }

  group_tweets_hierarchically(tweets: Array<any>) {
    const result = tweets.reduce((acc: any, curr: any) => {
      const label = curr.score.label;
      const reason = curr.reason;
      let by_label_group = acc[label];
      if (!by_label_group) {
        // new label
        by_label_group = {};
        acc[label] = by_label_group;
      }
      let by_reason_group = by_label_group[reason];
      if (!by_reason_group) {
        // new reason
        by_reason_group = [];
        by_label_group[reason] = by_reason_group;
      }
      by_reason_group.push(curr);
      return acc;
    }, {});
    return result;
  }

}
