import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { VennSet } from '../venn/venn.component';

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

  domain_sets: Array<VennSet> = [];

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getDatasets().subscribe((res: Array<any>) => {
      res.forEach((val) => {
        // just select the datasets that have a name and are used someway
        if (val.name && (val.contains.domain_classification)) {
          this.domain_datasets[val['_id']] = val;
          this.domain_datasets_list.push(val);
          this.displayedColumns.push(val.name);
        }
      });
    });
    this.apiService.getDomains().subscribe((res: Array<any>) => {
      this.domains = res;
      const initial_sets = this.domain_datasets_list.map(el => {
        return {size: 0, sets: new Set([el['_id']]), label: el['name']};
      });
      console.log(initial_sets);
      const sets_with_counts = res.reduce((prev: Array<any>, el: any) => {
        const a = new Set(el.score.sources);
        const match = prev.find((b: any) => {
          return a.size === b.sets.size && Array.from(a).every(value => b.sets.has(value));
        });
        if (match) {
          match.size++;
        } else {
          prev.push({size: 1, sets: a});
        }
        return prev;
      }, initial_sets) as Array<any>;
      this.domain_sets = sets_with_counts.map(el => {
        return {size: el.size as number, sets: Array.from(el.sets) as Array<string>, label: el.label}
      });//.slice(0, 10);
    });
  }

  getScore(element, d) {
    const result = element.score.sources.includes(d._id);
    return result;
  }
}
