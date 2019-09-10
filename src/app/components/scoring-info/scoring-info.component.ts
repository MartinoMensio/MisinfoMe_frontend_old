import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scoring-info',
  templateUrl: './scoring-info.component.html',
  styleUrls: ['./scoring-info.component.css']
})
export class ScoringInfoComponent implements OnInit {

  constructor(@Optional() public dialogRef: MatDialogRef<ScoringInfoComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    // it's an optional dependency, so it does not need to be run in a dialog but also works outside
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

}
