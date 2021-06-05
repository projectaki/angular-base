import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ObservableComponent } from './observable/observable.component';
import { HomeComponent } from './home/home.component';
import { ProductModule } from './products/product.module';
import { PolygonsFromMapModule } from './polygons-from-map/polygons-from-map.module';
import { AngularFormsModule } from './forms/angularforms.module';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { BatchingOperatorsComponent } from './observable/batching-operators/batching-operators.component';

@NgModule({
  declarations: [
    AppComponent,
    ObservableComponent,
    HomeComponent,
    BatchingOperatorsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'rxjs', component: BatchingOperatorsComponent },
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'rxjs', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ]),
    ProductModule,
    PolygonsFromMapModule,
    AngularFormsModule,
    SharedModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      name: 'ang-proj devtools',
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
