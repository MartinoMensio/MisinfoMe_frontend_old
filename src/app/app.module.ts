import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTweetModule } from 'ngx-tweet';
import { NestableModule } from 'ngx-nestable';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { GraphComponent } from './components/graph/graph.component';
import { AboutComponent } from './components/about/about.component';
import { TableTweetsComponent } from './components/table-tweets/table-tweets.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { DomainsComponent } from './components/domains/domains.component';
import { FactCheckingComponent } from './components/fact-checking/fact-checking.component';
import { VennComponent } from './components/venn/venn.component';
import { ImpactFactcheckingComponent } from './components/impact-factchecking/impact-factchecking.component';
import { CredibilityComponent } from './components/credibility/credibility.component';
import { SourcesComponent } from './components/sources/sources.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GraphComponent,
    AboutComponent,
    TableTweetsComponent,
    DatasetsComponent,
    DomainsComponent,
    FactCheckingComponent,
    VennComponent,
    ImpactFactcheckingComponent,
    CredibilityComponent,
    SourcesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTableModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectModule,
    MatSliderModule,
    NgxGraphModule,
    NgxChartsModule,
    NgxTweetModule,
    NestableModule,
    FlexLayoutModule,
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
