import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.css']
})
export class DatasetsComponent implements OnInit {

  datasets: Array<any>;
  displayedColumns: Array<String> = ['name', 'domain_classification', 'url_classification', 'fact_checking_urls'];

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getSourcesOld().subscribe((res: Array<any>) => {
      this.datasets = res.reduce((acc: Array<any>, val) => {
        // just select the datasets that have a name and are used someway
        if (val.name && (val.contains.domain_classification || val.contains.fact_checking_urls || val.contains.url_classification)) {
          acc.push(val);
        }
        return acc;
      }, []);
    });
  }

}
