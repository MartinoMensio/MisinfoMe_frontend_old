import { Component, OnInit, OnDestroy } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-origins',
  templateUrl: './origins.component.html',
  styleUrls: ['./origins.component.css']
})
export class OriginsComponent implements OnInit, OnDestroy {

  sources: Array<any>;
  private sub: Subscription;
  selected_source: any = null;

  constructor(private apiService: APIService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.apiService.getSourcesOld().subscribe((res: Array<any>) => {
      this.sources = res.reduce((acc: Array<any>, val) => {
        // just select the datasets that have a name and are used someway
        if (val.name && (val.contains.domain_classification || val.contains.fact_checking_urls || val.contains.url_classification)) {
          acc.push(val);
        }
        return acc;
      }, []);
    }).add(() => {
      this.sub = this.route.params.subscribe(params => {
        const source_id = params['source_id']
        this.selected_source = this.sources.find(el => el._id === source_id)
        if (!this.selected_source) {
          this.router.navigate(['/about/sources']);
        }
      });
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
