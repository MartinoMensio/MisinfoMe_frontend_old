import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  about_stats = [];
  displayedColumns: Array<String> = ['type', 'count'];

  node_size = {
    height: 80,
    width: 170
  };
  layoutSettingsVertical = {
    orientation: 'TB'
  };

  diagram_graph = {
    nodes: [
      {
        id: 'twitter',
        label: 'Twitter',
        data: {
          colour: '#0084b4',
          textColour: 'white'
        },
        dimension: this.node_size
      }, {
        id: 'ext_cred',
        label: 'External Assessments',
        data: {
          colour: '#db5139',
          textColour: 'white'
        },
        dimension: {...this.node_size, ...{width: 350}}
      }, {
        id: 'fc',
        label: 'Fact-Checkers',
        data: {
          colour: '#4caf50',
          textColour: 'white'
        },
        dimension: {...this.node_size, ...{width: 250}}
      }, {
        id: 'credibility',
        label: 'Credibility Model',
        data: {
          colour: '#f5d442'
        },
        dimension: {...this.node_size, ...{width: 250}}
      }, {
        id: 'backend',
        label: 'Backend',
        data: {
          colour: '#6BBBAE'
        },
        dimension: this.node_size
      }, {
        id: 'frontend',
        label: 'Frontend',
        data: {
          colour: '#693C5E',
          textColour: 'white'
        },
        dimension: this.node_size
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
