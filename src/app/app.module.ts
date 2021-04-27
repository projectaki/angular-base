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


@NgModule({
  declarations: [
    AppComponent,
    ObservableComponent,
    HomeComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]),
    ProductModule,
    PolygonsFromMapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
