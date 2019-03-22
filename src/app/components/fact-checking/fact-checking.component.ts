import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/api.service';

@Component({
  selector: 'app-fact-checking',
  templateUrl: './fact-checking.component.html',
  styleUrls: ['./fact-checking.component.css']
})
export class FactCheckingComponent implements OnInit {

  table_headers = ['name', 'nationality', 'belongs_to_ifcn', 'valid'];
  table_headers_indexes: Array<number> = [];
  table_data: Array<Array<string>>;

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getFactCheckers().subscribe((result: Array<Array<string>>) => {
      const headers_received = result[0];
      // tslint:disable-next-line:forin
      for (const i in this.table_headers) {
        this.table_headers_indexes[i] = headers_received.indexOf(this.table_headers[i]);
      }
      this.table_data = result.splice(1);
      console.log(this.table_headers);
      console.log(this.table_headers_indexes);
    });
  }

}
