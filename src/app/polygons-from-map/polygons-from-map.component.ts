import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from './map.service';

@Component({
  selector: 'pm-polygons-from-map',
  templateUrl: './polygons-from-map.component.html',
  styleUrls: ['./polygons-from-map.component.css'],
})
export class PolygonsFromMapComponent implements OnInit {
  constructor(private map: MapService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.map.buildSelectionMap();
    this.map.buildDisplayMap();
  }

  mouseClickHandler = async () => {
    const polygons = await this.map.getAllPolygons();
    console.log(polygons);
  };

  clickMe() {
    this.map.updateDeckData(5);
  }
}
