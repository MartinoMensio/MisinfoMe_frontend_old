import { Component, OnInit, Input, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Source } from 'webpack-sources';

@Component({
  selector: 'app-source-card',
  templateUrl: './source-card.component.html',
  styleUrls: ['./source-card.component.css']
})
export class SourceCardComponent implements OnInit {

  factcheckingReports: any;
  // byFactchecker: List<any>;
  by_factchecker: any;
  reports: Array<any>;
  chartData: any;
  colorScheme = {
    domain: ['#3cff00', '#a2ff00', '#ffff00', '#ff5100', '#AAAAAA']
  };

  _sourceAssessment: any;
  @Input()
  set sourceAssessment(sourceAssessments) {
    sourceAssessments.assessments_without_fc = [];
    sourceAssessments.assessments.forEach((element, index) => {
      if (element.origin_id === 'factchecking_report') {
        this.factcheckingReports = element;
        this.reports = element.reports;
        // sourceAssessments.assessments.splice(index, 1);
        this.by_factchecker = this.reports.reduce((prev, curr) => {
          if (!curr.origin) {
            // Not IFCN
            return prev;
          }
          const group = curr.origin.id;
          const coinform_label = curr.coinform_label;
          if (!prev[group]) {
            prev[group] = {}
            // prev.origin_id = group
          }
          if (!prev[group][coinform_label]) {
            prev[group][coinform_label] = new Set()
          }
          prev[group][coinform_label].add(curr.report_url)
          return prev;
        }, {});
        console.log(this.by_factchecker);
        this.chartData = [];
        for (let origin_id in this.by_factchecker) {
          const by_origin = this.by_factchecker[origin_id];
          // const series = []
          // for (let label in by_origin) {
          //   const count = by_origin[label].size;
          //   // series.push({
          //   //   name: label,
          //   //   value: count
          //   // })
          // }
          // TODO at the moment this must be done in strict order for the colours to work
          const series = [{
            name: 'credible',
            value: (by_origin['credible'] || new Set()).size
          }, {
            name: 'mostly credible',
            value: (by_origin['mostly_credible'] || new Set()).size
          }, {
            name: 'uncertain',
            value: (by_origin['uncertain'] || new Set()).size
          }, {
            name: 'not credible',
            value: (by_origin['not_credible'] || new Set()).size
          }, {
            name: 'not verifiable',
            value: (by_origin['not_verifiable'] || new Set()).size
          },
          ]
          this.chartData.push({
            name: origin_id,
            series: series
          })
        }

        // this.chartData = by_factchecker.reduce((prev: Array<any>, curr) => {
        //   prev.push({
        //     name: curr.origin_id || 'overall',
        //     series: [{
        //       name: 'not_credible',
        //       value: (curr.not_credible || new Set()).size,
        //     }, //{
        //     //   name: 'negative',

        //     //   value: (curr.negative || new Set()).size
        //     // }, {
        //     //   name: 'neutral',
        //     //   value: (curr.neutral || []).length,

        //     // }, {
        //     //   name: 'unknown',
        //     //   value: (curr.unknown || []).length

        //     // }
        //   ]
        //   });
        //   return prev;
        // }, [])
        console.log(this.chartData)
      } else {
        sourceAssessments.assessments_without_fc.push(element);
      }
    });
    this._sourceAssessment = sourceAssessments;
  }
  get sourceAssessment() {
    return this._sourceAssessment;
  }

  constructor(@Optional() public dialogRef: MatDialogRef<SourceCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data) {
        this.sourceAssessment = data;
      }
    }

  ngOnInit() {
  }

  select(event) {
    console.log(event);
    // TODO
    // this appears on the legend or on the areas of the plot
    // can be used to filter
  }

}
