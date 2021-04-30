import { Injectable } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: any;
  draw: any;
  style = 'mapbox://styles/mapbox/dark-v10';
  lat = 45.899977;
  lng = 6.172652;
  zoom = 12;

  constructor() {}

  buildMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
    });

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    this.map.addControl(this.draw);
    let count = 0;
    this.map.on('draw.create', () => count++);
    this.map.on('draw.delete', () => count--);
    // map.on("draw.update", () => (isSubmitable = true));
  }

  getAllPolygons = () => {
    var FeatureCollection = this.draw?.getAll();
    const polygons = [];
    for (let feature of FeatureCollection.features) {
      polygons.push(feature.geometry.coordinates[0]);
    }
    return polygons;
  };
}
