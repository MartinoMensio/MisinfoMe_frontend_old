import { Component, OnInit } from '@angular/core';
import { APIService } from '../../api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  about_stats = [];
  displayedColumns: Array<String> = ['type', 'count'];

  diagram_graph = {
    nodes: [
      {
        id: 'twitter',
        label: 'Twitter',
        data: {
          colour: '#0084b4',
          textColour: 'white'
        }
      }, {
        id: 'ext_cred',
        label: 'External Assessments',
        data: {
          colour: '#db5139',
          textColour: 'white'
        }
      }, {
        id: 'fc',
        label: 'Fact-Checkers',
        data: {
          colour: '#4caf50',
          textColour: 'white'
        }
      }, {
        id: 'credibility',
        label: 'Credibility Model',
        data: {
          colour: '#f5d442'
        }
      }, {
        id: 'backend',
        label: 'Backend',
        data: {
          colour: '#6BBBAE'
        }
      }, {
        id: 'frontend',
        label: 'Frontend',
        data: {
          colour: '#693C5E',
          textColour: 'white'
        }
      }
    ],
    links: [{
      id: 'a',
      source: 'frontend',
      target: 'backend',
      label: 'REST'
    }, {
      id: 'b',
      source: 'backend',
      target: 'twitter',
      label: 'REST'
    }, {
      id: 'c',
      source: 'backend',
      target: 'credibility',
      label: 'REST'
    }, {
      id: 'd',
      source: 'credibility',
      target: 'fc',
      label: 'DATA COLLECTION'
    }, {
      id: 'e',
      source: 'credibility',
      target: 'ext_cred',
      label: 'DATA COLLECTION'
    }
  ]
  };

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getStats().subscribe(res => {
      this.about_stats = Object.keys(res).reduce((acc: Array<any>, cur) => {
        acc.push({ 'type': cur, 'count': res[cur] });
        return acc;
      }, []);
      console.log('hola');
    });
  }

}
