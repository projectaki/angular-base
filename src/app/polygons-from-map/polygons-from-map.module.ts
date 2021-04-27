import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PolygonsFromMapComponent } from './polygons-from-map.component';

@NgModule({
  declarations: [
    PolygonsFromMapComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'map', component: PolygonsFromMapComponent },

    ])
  ]
})
export class PolygonsFromMapModule { }
