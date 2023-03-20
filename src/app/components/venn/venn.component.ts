import { Component, OnInit, Input } from '@angular/core';
import * as venn from 'venn.js';
import * as d3 from 'd3';

export interface VennSet {
  sets: Array<string>;
  size: number;
  options?: Object;
  label?: string;
}

@Component({
  selector: 'app-venn',
  templateUrl: './venn.component.html',
  styleUrls: ['./venn.component.css']
})
export class VennComponent implements OnInit {

  private _sets: Array<VennSet>;
  get sets(): Array<VennSet> {
    return this._sets;
  }
  @Input()
  set sets(sets: Array<VennSet>) {
    this._sets = sets;
    this.update_chart();
  }

  @Input()
  width = 500;

  @Input()
  height = 500;

  @Input()
  label = 'entries';

  constructor() { }

  ngOnInit() { }

  update_chart() {
    const chart = venn.VennDiagram().width(this.width).height(this.height);
    const div = d3.select('#venn');
    div.datum(this.sets).call(chart);

    const tooltip = d3.select('#venn').append('div').attr('class', 'venntooltip')
      .style('position', 'absolute')
      .style('text-align', 'center')
      .style('width', '128px')
      .style('height', '16px')
      .style('background', '#333')
      .style('color', '#ddd')
      .style('padding', '2px')
      .style('border', '0px')
      .style('border-radius', '8px')
      .style('opacity', '0');

    div.selectAll('path')
      .style('stroke-opacity', 0)
      .style('stroke', '#fff')
      .style('stroke-width', 3);

    const that = this;

    div.selectAll('g')
      .on('mouseover', function (d: any, i) {
        // sort all the areas relative to the current item
        venn.sortAreas(div, d);

        // Display a tooltip with the current size
        tooltip.transition().duration(400).style('opacity', .9);
        tooltip.text(`${d.size} ${that.label}`);

        // highlight the current path
        const selection = d3.select(this).transition('tooltip').duration(400);
        selection.select('path')
          .style('fill-opacity', d.sets.length === 1 ? .4 : .1)
          .style('stroke-opacity', 1);
      })

      .on('mousemove', function () {
        tooltip.style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })

      .on('mouseout', function (d: any, i) {
        tooltip.transition().duration(400).style('opacity', 0);
        const selection = d3.select(this).transition('tooltip').duration(400);
        selection.select('path')
          .style('fill-opacity', d.sets.length === 1 ? .25 : .0)
          .style('stroke-opacity', 0);
      });
  }

}
