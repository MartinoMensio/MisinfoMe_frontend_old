import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { OriginsComponent } from './components/origins/origins.component';
import { DomainsComponent } from './components/domains/domains.component';
import { FactCheckingComponent } from './components/fact-checking/fact-checking.component';
import { ImpactFactcheckingComponent } from './components/impact-factchecking/impact-factchecking.component';
import { CredibilitySourcesComponent } from './components/credibility-sources/credibility-sources.component';
import { CredibilityComponent } from './components/credibility/credibility.component';
import { CredibilityOriginsComponent } from './components/credibility-origins/credibility-origins.component';
import { CredibilityProfilesComponent } from './components/credibility-profiles/credibility-profiles.component';
import { ScoringInfoComponent } from './components/scoring-info/scoring-info.component';

const routes: Routes = [
  { path: 'analyse/:screen_name', component: HomeComponent },
  { path: 'analyse', redirectTo: '/home'},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'about/datasets', component: DatasetsComponent },
  { path: 'about/origins', component: OriginsComponent },
  { path: 'about/origins/:source_id', component: OriginsComponent },
  // { path: 'about/datasets/:dataset_name', component: DatasetsComponent },
  { path: 'about/domains', component: DomainsComponent },
  // { path: 'about/domains/:domain', component: DomainsComponent },
  { path: 'about/fact_checking', component: FactCheckingComponent },
  { path: 'about/scoring', component: ScoringInfoComponent },
  { path: 'impact_factchecking', component: ImpactFactcheckingComponent },
  { path: 'credibility', component: CredibilityComponent },
  { path: 'credibility/sources', component: CredibilitySourcesComponent },
  { path: 'credibility/sources/:source', component: CredibilitySourcesComponent },
  { path: 'credibility/origins', component: CredibilityOriginsComponent },
  { path: 'credibility/profiles', component: CredibilityProfilesComponent },
  { path: 'credibility/profiles/:screen_name', component: CredibilityProfilesComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
