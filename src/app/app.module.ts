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

@NgModule({
  declarations: [AppComponent, ObservableComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'forms', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ]),
    ProductModule,
    PolygonsFromMapModule,
    AngularFormsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
