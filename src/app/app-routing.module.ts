import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { SourcesComponent } from './components/sources/sources.component';
import { DomainsComponent } from './components/domains/domains.component';
import { FactCheckingComponent } from './components/fact-checking/fact-checking.component';
import { ImpactFactcheckingComponent } from './components/impact-factchecking/impact-factchecking.component';
import { CredibilityComponent } from './components/credibility/credibility.component';

const routes: Routes = [
  { path: 'analyse/:screen_name', component: HomeComponent },
  { path: 'analyse', redirectTo: '/home'},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'about/datasets', component: DatasetsComponent },
  { path: 'about/sources', component: SourcesComponent },
  { path: 'about/sources/:source_id', component: SourcesComponent },
  // { path: 'about/datasets/:dataset_name', component: DatasetsComponent },
  { path: 'about/domains', component: DomainsComponent },
  // { path: 'about/domains/:domain', component: DomainsComponent },
  { path: 'about/fact_checking', component: FactCheckingComponent },
  { path: 'impact_factchecking', component: ImpactFactcheckingComponent },
  { path: 'credibility', component: CredibilityComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
