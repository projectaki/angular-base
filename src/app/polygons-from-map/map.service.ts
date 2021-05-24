import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';

// import Deck from '@deck.gl/core';
const { Deck } = require('@deck.gl/core');
const { GeoJsonLayer, ArcLayer, ColumnLayer } = require('@deck.gl/layers');
const { MapboxLayer } = require('@deck.gl/mapbox');

@Injectable({
  providedIn: 'root',
})
export class MapService {
  res$: Observable<any> = this.http.get(
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/hexagons.json'
  );

  newDataSubject = new Subject<any>();
  newData$ = this.newDataSubject.asObservable().pipe(startWith([]));

  data$ = combineLatest([this.res$, this.newData$]).pipe(
    map(([original, newData]) => {
      if (newData.length === 0) return original;
      else return newData;
    })
  );
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

  COLUMN_LAYER_DATA =
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/hexagons.json';

  half: any;

  colLayer: any;

  constructor(public http: HttpClient) {}

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

  clonk() {
    this.res$.pipe(map((data) => data.slice(0, 30))).subscribe((data) => {
      this.newDataSubject.next(data);
    });
    this.data$.subscribe((data: any) => {
      const layers = [
        new ColumnLayer({
          id: 'column-layer',
          data: data,
          diskResolution: 12,
          radius: 250,
          extruded: true,
          pickable: true,
          autoHighlight: true,
          elevationScale: 5000,
          getPosition: (d: { centroid: any }) => d.centroid,
          getFillColor: (d: { value: number }) => [48, 128, d.value * 255, 255],
          getLineColor: [0, 0, 0],
          getElevation: (d: { value: any }) => d.value,
        }),
      ];
      console.log(layers);
      this.deck.setProps({ layers: layers });
    });
  }

  buildMap2() {
    this.res$.subscribe((data) => {
      console.log('HHHHERE', data),
        ((mapboxgl as any).accessToken = environment.mapbox.accessToken);
      const INITIAL_VIEW_STATE = {
        latitude: 37.773972,
        longitude: -122.431297,
        zoom: 10,
        bearing: 0,
        pitch: 30,
      };

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

      this.colLayer = new ColumnLayer({
        id: 'column-layer',
        data: data,
        diskResolution: 12,
        radius: 250,
        extruded: true,
        pickable: true,
        autoHighlight: true,
        elevationScale: 5000,
        getPosition: (d: { centroid: any }) => d.centroid,
        getFillColor: (d: { value: number }) => [48, 128, d.value * 255, 255],
        getLineColor: [0, 0, 0],
        getElevation: (d: { value: any }) => d.value,
      });

      this.deck = new Deck({
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
        getTooltip: ({ object }: any) =>
          object && `height: ${object.value * 5000}m`,
        layers: [this.colLayer],
      });
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
