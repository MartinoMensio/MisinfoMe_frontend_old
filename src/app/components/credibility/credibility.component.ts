import { Component, OnInit } from '@angular/core';
import { APIService, CountResult, OverallCounts } from '../../api.service';
import { forceManyBody, forceCollide, forceX, forceY, forceLink, forceSimulation } from 'd3-force';
import * as $ from 'jquery';

@Component({
  selector: 'app-credibility',
  templateUrl: './credibility.component.html',
  styleUrls: ['./credibility.component.css']
})
export class CredibilityComponent implements OnInit {

  credibility_graph: any = null;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  graph_force = forceSimulation<any>()
    .force('charge', forceManyBody().strength(-100)) // repulsion of the nodes
    .force('x', forceX()) // make them go to the center
    .force('y', forceY())
    .alphaDecay(0.1); // decay bigger so stop faster
  // .force('collide', forceCollide(30))
  graph_force_link = forceLink<any, any>().distance(100).id(node => node.value); // the desired length of the links

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getCredibilityGraph().subscribe(result => {
      this.credibility_graph = this.generateGraph(result);
      this.credibility_graph.trick(this.credibility_graph);
    });
  }

  generateGraph(source_graph: any) {
    const graph = {
      links: [],
      nodes: [],
      overall_move_x: 10,
      overall_move_y: 10, // the whole graph is translated
      update_trick_ticks: 50,
      update_trick_interval: 100, // milliseconds
      trick: (g) => {
        // This function is needed because the ngx-charts-force-directed-graph is just animating the links and not the edges,
        // unless the mouse moves on the svg.
        // The trick is simply trigger programmatically clicks every 100ms for 5 secs on the center of the graph in order
        // to trigger the update of the position of the edges.
        setTimeout(() => {
          // console.log(`i am a trick ${g} at ${g.update_trick_ticks}`);
          g.update_trick_ticks -= 1;
          if (g.update_trick_ticks > 0) {
            g.trick(g);
            const selector = `g.nodes g`;
            // console.log(selector);
            $(selector).get(0).dispatchEvent(new Event('click'));
          }
        }, g.update_trick_interval);
      }
    };
    //console.log(source_graph.nodes)
    for (const n_name in source_graph.nodes) {
      const n = source_graph.nodes[n_name];
      //console.log(n)
      graph.nodes.push({
        value: n._id,
        options: {
          image: n.avatar,
          size: 20,
          fill: this.getColor(n),
          //stroke: this.getColor(you)
        }
      });
    }
    // console.log(friends_scores);
    for (const l of source_graph.links) {
      graph.links.push({
        source: l.from,
        target: l.to,
        options: {
          //color: this.getColor(friend_score) + '!important'
        }
      });
    }
    return graph;
  }

  select_node(event: any) {
    return;
  }

  getColor(node: any) {
    if (node.type === 'source') {
      return 'rgb(90, 164, 84)';
    } else if (node.type === 'document') {
      return 'rgb(161, 10, 40)';
    } else {
      return 'grey';
    }
  }

}
