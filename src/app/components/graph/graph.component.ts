import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { APIService, CountResult } from 'src/app/api.service';
import { Subject } from 'rxjs';
import { forceManyBody, forceCollide, forceX, forceY, forceLink, forceSimulation, forceCenter } from 'd3-force';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { Edge, Node, ClusterNode } from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  layout = 'd3ForceDirected';
  curve = shape.curveLinear;

  draggingEnabled = true;
  panningEnabled = false;
  zoomEnabled = false;

  zoomSpeed = 0.1;
  minZoomLevel = 0.1;
  maxZoomLevel = 4.0;
  panOnZoom = false;

  autoZoom = false;
  autoCenter = false;

  update$ = null; // : Subject<boolean> = new Subject();
  center$ = null; // : Subject<boolean> = new Subject();
  zoomToFit$ = null; // : Subject<boolean> = new Subject();

  layoutSettings: any = null;



  // node_size = 20;
  // colorScheme = {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };


  friends_graph: { links: any[]; nodes: any[]; };
  // graph_force = forceSimulation<any>()
  //   .force('charge', forceManyBody().strength(-600)) // repulsion of the nodes
  //   .force('x', forceX()) // make them go to the center
  //   .force('y', forceY())
  //   .alphaDecay(0.1); // decay bigger so stop faster
  // // .force('collide', forceCollide(30))
  // graph_force_link = forceLink<any, any>().distance(100).id(node => node.value); // the desired length of the links

  friends_screen_names = {}; // a dict {'screen_name': analysed(Boolean)}
  already_analysed = 0;
  total_friends = 0;
  analyse_remaining_disabled = true;
  friends_results: Array<CountResult>;

  private _main_profile: CountResult;
  @Input()
  set main_profile(profile) {
    this._main_profile = profile;
    this.create_graph();
  }
  get main_profile() {
    return this._main_profile;
  }

  // For differentiate drag and click
  last_event: any = null;


  graphHeight: number;
  graphWidth: number;


  @Output()
  new_friend_emitter = new EventEmitter<CountResult>();

  constructor(private apiService: APIService, private router: Router) { }

  ngOnInit() {
    this.fitGraph();
  }

  onResize(event) {
    this.fitGraph(0);
  }

  fitGraph(time=2000) {
    console.log('fitting the graph');
    setTimeout(() => {
      // panning-rect is preventing the scroll!!!!
      // const el = $('.panning-rect');
      // el.remove();
      this.graphHeight = $('ngx-graph').height();
      this.graphWidth = $('ngx-graph').width(); // if panning-rect is not removed, the graph position is relative to it
      console.log(`size: ${this.graphWidth}x${this.graphHeight}`);

      this.layoutSettings = {
        // force: forceSimulation<any>()
          // .force('charge', forceManyBody().strength(-150))
          // .force('collide', forceCollide(5)),
        force: forceSimulation<any>()
        .force('charge', forceManyBody().strength(-1000)) // repulsion of the nodes
        // .force('center', forceCenter(600, 500))
        .force('x', forceX(this.graphWidth / 2)) // make them go to the center
        .force('y', forceY(this.graphHeight / 2))
        // tried to add bounding box force, but does not work
        // .alphaDecay(0.1) // decay bigger so stop faster
        ,
        // forceLink: forceLink<any, any>()
        //   .id(node => node.id)
        //   .distance(() => 100)
        forceLink: forceLink<any, any>()
        .distance(100)
        .id(node => node.value),
      };
      // setTimeout(() => {
      //   console.log('delayed')
      //   this.zoomToFit$.next(true);
      // }, 10000)
    }, time);
  }

  create_graph() {
    this.apiService.getFriendsCount(this.main_profile.screen_name).subscribe((res: Array<CountResult>) => {
      this.friends_graph = this.generateGraph(this.main_profile, []);
      this.already_analysed = 0;
      this.total_friends = res.length;
      this.friends_results = [];
      this.friends_results.forEach(el => {
        this.new_friend_emitter.emit(el);
      });
      res.forEach((el: CountResult) => {
        if (el.cache === 'miss') {
          // this is a cache miss, profile not yet evaluated
          this.friends_screen_names[el.screen_name] = false;
        } else {
          // cache hit
          this.friends_screen_names[el.screen_name] = true;
          this.update_friends_stat_with_new(el);
        }
      });
      if (this.already_analysed < this.total_friends) {
        this.analyse_remaining_disabled = false;
      } else {
        this.analyse_remaining_disabled = true;
      }
      console.log(this.friends_graph);
      this.fitGraph();
    });

  }

  update_friends_stat_with_new(friend: CountResult) {
    this.friends_results.push(friend);
    this.new_friend_emitter.emit(friend);
    this.already_analysed++;

    this.friends_graph = this.generateGraph(this.main_profile, this.friends_results);
  }

  generateGraph(you: CountResult, friends_scores: Array<CountResult>) {
    const graph = {
      links: [],
      nodes: []
    };
    graph.nodes.push({
      value: you.screen_name,
      label: you.screen_name,
      id: you.screen_name,
      options: {
        image: you.profile_image_url,
        size: 20,
        fill: this.getColor(you),
        stroke: this.getColor(you)
      }
    });
    // console.log(friends_scores);
    for (const f of friends_scores) {
      this.updateGraphWithFriend(graph, you, f);
    }
    return graph;
  }

  getColor(counts: CountResult) {
    if (counts.score > 50) {
      return 'rgb(90, 164, 84)';
    } else if (counts.score < 50) {
      return 'rgb(161, 10, 40)';
    } else {
      return 'grey';
    }
  }

  updateGraphWithFriend(graph, you, friend_score) {
    graph.nodes.push({
      value: friend_score.screen_name, // do I want it?
      label: friend_score.screen_name, // wanted by GroupResultsBy
      id: friend_score.screen_name, // wanted by graph structure
      // x: -100,
      // y: 0,
      options: {
        image: friend_score.profile_image_url,
        size: 20,
        fill: this.getColor(friend_score),
        stroke: this.getColor(friend_score)
      }
    });
    graph.links.push({
      source: you.screen_name,
      target: friend_score.screen_name,
      options: {
        color: this.getColor(friend_score) + '!important'
      }
    });
  }
  getGraphHeight() {
    // a proportional value to the friends, between the two extremes
    const min_height = 500;
    const max_height = 1200;
    const max_friends = 500;
    return min_height + (this.already_analysed) * (max_height - min_height) / max_friends;
  }

  analyse_remaining() {
    this.analyse_remaining_disabled = true;
    const candidate = this.get_candidate();
    return this.analyse_candidate(candidate);
  }

  get_candidate() {
    return Object.keys(this.friends_screen_names).find(el => !this.friends_screen_names[el]);
  }

  analyse_candidate(candidate: string): Promise<any> {
    if (!candidate) {
      return Promise.resolve();
    }
    return this.apiService.postUserCount([candidate]).toPromise().then((result: CountResult) => {
      this.update_friends_stat_with_new(result);
      this.friends_screen_names[candidate] = true;
      const next = this.get_candidate();
      return this.analyse_candidate(next);
    }, error => {
      console.log(`error: ${error}`);
      this.friends_screen_names[candidate] = true;
      const next = this.get_candidate();
      return this.analyse_candidate(next);
    }).finally(() => {
      this.fitGraph();
    });
  }

  select_node(event: any) {
    // console.log('node selected');
    console.log(event);
    const screen_name = event.id;
    // console.log(screen_name);
    this.router.navigate(['/analyse', screen_name]);
    return;
  }

  // https://www.w3.org/TR/SVG11/interact.html no drag support, and just using click captures also the drag
  // therefore we need to compare the position of the events
  mousedown(event) {
    console.log(`down ${event.clientX} ${event.clientY}`);
    this.last_event = event;
  }
  mouseup(event, node) {
    console.log(`up ${event.clientX} ${event.clientY}`);
    if (event.clientX === this.last_event.clientX && event.clientY === this.last_event.clientY) {
      this.select_node(node);
    }
  }
}
