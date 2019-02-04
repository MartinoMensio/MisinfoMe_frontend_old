import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/api.service';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.css']
})
export class DomainsComponent implements OnInit {

  domain_datasets = {};
  domain_datasets_list: Array<any> = [];
  domains: Array<any> = [];
  displayedColumns: Array<String> = ['domain', 'label'];

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getDatasets().subscribe((res: Array<any>) => {
      res.forEach((val) => {
        // just select the datasets that have a name and are used someway
        if (val.name && (val.contains.domain_classification || val.contains.fact_checking_urls || val.contains.url_classification)) {
          this.domain_datasets[val['_id']] = val;
          this.domain_datasets_list.push(val);
          this.displayedColumns.push(val.name);
        }
      });
    });
    this.apiService.getDomains().subscribe((res: Array<any>) => {
      this.domains = res;
    });
  }

  getScore(element, d) {
    const result = element.score.sources.includes(d._id);
    return result;
  }
}
