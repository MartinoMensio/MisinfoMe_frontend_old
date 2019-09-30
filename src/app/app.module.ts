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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTweetModule } from 'ngx-tweet';
import { NestableModule } from 'ngx-nestable';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxGaugeModule } from 'ngx-gauge';

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
import { CredibilitySourcesComponent } from './components/credibility-sources/credibility-sources.component';
import { OriginsComponent } from './components/origins/origins.component';
import { ValidatePreventDirective } from './directives/validate-prevent.directive';
import { SourceCardComponent } from './components/source-card/source-card.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { CredibilityProfilesComponent } from './components/credibility-profiles/credibility-profiles.component';
import { CredibilityOriginsComponent } from './components/credibility-origins/credibility-origins.component';
import { CredibilityComponent } from './components/credibility/credibility.component';
import { ErrorComponent } from './components/error/error.component';
import { CredibilityMeterComponent } from './components/credibility-meter/credibility-meter.component';
import { ImgFallbackDirective } from './directives/img-fallback.directive';
import { SearchUserComponent } from './components/search-user/search-user.component';
import { ScoringInfoComponent } from './components/scoring-info/scoring-info.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchSourceComponent } from './components/search-source/search-source.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LegacyAnalysisComponent } from './components/legacy-analysis/legacy-analysis.component';
import { TweetsListComponent } from './components/tweets-list/tweets-list.component';
import { UrlReviewedCardComponent } from './components/url-reviewed-card/url-reviewed-card.component';

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
    CredibilitySourcesComponent,
    OriginsComponent,
    ValidatePreventDirective,
    SourceCardComponent,
    ProfileCardComponent,
    CredibilityProfilesComponent,
    CredibilityOriginsComponent,
    CredibilityComponent,
    ErrorComponent,
    CredibilityMeterComponent,
    ImgFallbackDirective,
    SearchUserComponent,
    ScoringInfoComponent,
    SearchSourceComponent,
    SettingsComponent,
    LegacyAnalysisComponent,
    TweetsListComponent,
    UrlReviewedCardComponent,
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
    MatAutocompleteModule,
    MatDialogModule,
    MatRadioModule,
    MatSnackBarModule,
    FontAwesomeModule,
    NgxGraphModule,
    NgxChartsModule,
    NgxTweetModule,
    NestableModule,
    FlexLayoutModule,
    InfiniteScrollModule,
    NgxGaugeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SourceCardComponent, TweetsListComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
