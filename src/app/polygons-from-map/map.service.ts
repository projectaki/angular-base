import { Injectable } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';

// import Deck from '@deck.gl/core';
const { Deck } = require('@deck.gl/core');
const { GeoJsonLayer, ArcLayer } = require('@deck.gl/layers');
const { MapboxLayer } = require('@deck.gl/mapbox');

@Injectable({
  providedIn: 'root',
})
export class MapService {
  /**
   * The map variable which holds the map instance
   */
  map: any;
  deck: any;
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

  buildMap2() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    const INITIAL_VIEW_STATE = {
      latitude: 51.47,
      longitude: 0.45,
      zoom: 4,
      bearing: 0,
      pitch: 30,
    };
    const AIR_PORTS =
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      // Note: deck.gl will be in charge of interaction and event handling
      interactive: false,
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      bearing: INITIAL_VIEW_STATE.bearing,
      pitch: INITIAL_VIEW_STATE.pitch,
    });
    const deck = new Deck({
      canvas: 'deck-canvas',
      width: '100%',
      height: '100%',
      initialViewState: INITIAL_VIEW_STATE,
      controller: true,
      onViewStateChange: ({ viewState }: any) => {
        map.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch,
        });
      },
      layers: [
        new GeoJsonLayer({
          id: 'airports',
          data: AIR_PORTS,
          filled: true,
          pointRadiusMinPixels: 2,
          opacity: 1,
          pointRadiusScale: 2000,
          getRadius: (f: { properties: { scalerank: number } }) =>
            11 - f.properties.scalerank,
          getFillColor: [200, 0, 80, 180],
          pickable: true,
          autoHighlight: true,
        }),
        new ArcLayer({
          id: 'arcs',
          data: AIR_PORTS,
          dataTransform: (d: { features: any[] }) =>
            d.features.filter((f) => f.properties.scalerank < 4),
          // Styles
          getSourcePosition: () => [-0.4531566, 51.4709959], // London
          getTargetPosition: (f: { geometry: { coordinates: any } }) =>
            f.geometry.coordinates,
          getSourceColor: [0, 128, 200],
          getTargetColor: [200, 0, 80],
          getWidth: 1,
        }),
      ],
    });
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
