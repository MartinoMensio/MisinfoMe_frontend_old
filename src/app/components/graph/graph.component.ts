import { Component, OnInit, Input } from '@angular/core';
import { curveLinear, curveBundle } from 'd3-shape';
import { element } from '@angular/core/src/render3';

interface Node {
  id: string
  external_url?: string
  score?: number,
  label: string
}

interface Edge {
  source: string
  target: string
  label: string
}
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {
  //@Input() data;
  curve_fn = curveBundle;
  view: any[];
  autoZoom: boolean = false;
  panOnZoom: boolean = true;
  enableZoom: boolean = true;
  autoCenter: boolean = false;
  showLegend: boolean = false;
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  private _data;
  get data() {
    return this._data
  }
  @Input()
  set data(value) {
    console.log('changed data!!')
    this._data = value
    if (value && value.score) {
      this.load_data(value)
    }
  }

  load_data(json_data) {
    let [nodes, edges] = this.extract_nodes_and_edges(json_data)
    console.log(nodes, edges)

    this.fix_ids(nodes, edges)
    console.log(nodes, edges)

    this.nodes = nodes;
    this.links = edges;
  }

  get_colour(score) {
    if (score > 0) {
      return `rgb(0,${Math.abs(score*255)},0)`
    } else if (score < 0) {
      return `rgb(${Math.abs(score*255)},0,0)`
    } else {
      return 'white'
    }
  }

  private fix_ids(nodes: Array<Node>, links: Array<Edge>) {
    let node_by_id = {}
    // remove duplicates by using this first object
    nodes.forEach(el => {
      node_by_id[el.id] = el
    })
    let mappings = {}
    let next_id = 0
    for (let key in node_by_id) {
      mappings[key] = (next_id++).toString()
    }
    nodes.forEach(element => {
      element.id = mappings[element.id]
    });
    links.forEach(element => {
      element.source = mappings[element.source]
      element.target = mappings[element.target]
    })
  }

  private extract_nodes_and_edges(json_data): [Array<Node>, Array<Edge>] {
    let nodes = []
    let edges = []

    let node = {
      id: json_data.resource_url,
      external_url: json_data.external_url,
      score: json_data.score.value,
      label: json_data.resource_url
    }
    nodes.push(node)
    json_data.reasons.forEach(element => {
      console.log(element.relationship_type)
      let edge = {
        source: node.id,
        target: element.related_analysis.resource_url,
        label: element.relationship_type
      }
      let [other_nodes, other_edges] = this.extract_nodes_and_edges(element.related_analysis)
      edges.push(edge);
      edges = edges.concat(other_edges)
      nodes = nodes.concat(other_nodes)
    });

    return [nodes, edges]
  }

  nodes: Array<Node> = [
    {
      id: 'start',
      label: 'start'
    }, {
      id: '1',
      label: 'Query ThreatConnect',
    }, {
      id: '2',
      label: 'Query XForce',
    }, {
      id: '3',
      label: 'Format Results'
    }, {
      id: '4',
      label: 'Search Splunk'
    }, {
      id: '5',
      label: 'Block LDAP'
    }, {
      id: '6',
      label: 'Email Results'
    }
  ]
  links = [
    {
      source: 'start',
      target: '1',
      label: 'links to'
    }, {
      source: 'start',
      target: '2'
    }, {
      source: '1',
      target: '3',
      label: 'related to'
    }, {
      source: '2',
      target: '4'
    }, {
      source: '2',
      target: '6'
    }, {
      source: '3',
      target: '5'
    }
  ]

  constructor() { }

  ngOnInit() {
    //this.load_data(this.data);
  }

}