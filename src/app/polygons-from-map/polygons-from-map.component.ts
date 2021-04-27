import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from './map.service';

@Component({
  selector: 'pm-polygons-from-map',
  templateUrl: './polygons-from-map.component.html',
  styleUrls: ['./polygons-from-map.component.css']
})
export class PolygonsFromMapComponent implements OnInit {

  constructor(private map: MapService) {}

  ngOnInit(): void {
    this.map.buildMap();
  }

}
