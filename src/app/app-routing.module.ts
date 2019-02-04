import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { DomainsComponent } from './components/domains/domains.component';

const routes: Routes = [
  { path: 'analyse/:screen_name', component: HomeComponent },
  { path: 'analyse', redirectTo: '/home'},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'about/datasets', component: DatasetsComponent },
  // { path: 'about/datasets/:dataset_name', component: DatasetsComponent },
  { path: 'about/domains', component: DomainsComponent },
  // { path: 'about/domains/:domain', component: DomainsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
