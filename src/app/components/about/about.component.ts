import { Component, OnInit } from '@angular/core';
import { APIService } from '../../api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  about_stats = []
  displayedColumns: Array<String> = ['type', 'count']

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getStats().subscribe(res => {
      this.about_stats = Object.keys(res).reduce((acc: Array<any>, cur) => {
        acc.push({'type': cur, 'count': res[cur]})
        return acc
      }, []);
      console.log('hola')
    })
  }

}
