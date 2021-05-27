import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, scan, startWith, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as turf from '@turf/turf';

const { Deck } = require('@deck.gl/core');
const { GeoJsonLayer, ArcLayer, ColumnLayer } = require('@deck.gl/layers');
const { MapboxLayer } = require('@deck.gl/mapbox');

@Injectable({
  providedIn: 'root',
})
export class MapService {
  // when dataset loads, build the two maps
  dataset$: Observable<any> = this.http
    .get(
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/hexagons.json'
    )
    .pipe(
      tap((data) => {
        this.buildSelectionMap();
        this.buildDisplayMap(data);
      })
    );

  // Observable which emits when polygons are updated
  polygonSubject = new Subject<any>();
  polygons$ = this.polygonSubject.asObservable();

  // when polygons are updated, calls the filter function
  filteredData$ = combineLatest([this.dataset$, this.polygons$]).pipe(
    tap(([dataset, polygons]) => {
      this.filterDataByPolygons(dataset, polygons);
    })
  );

  draw: any;
  deck: any;
  displayMap: any;

  INITIAL_VIEW_STATE = {
    latitude: 37.773972,
    longitude: -122.431297,
    zoom: 10,
    bearing: 0,
    pitch: 30,
    style: 'mapbox://styles/mapbox/dark-v10',
  };

  constructor(public http: HttpClient) {}

  buildSelectionMap() {
    const map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'selection-map',
      style: this.INITIAL_VIEW_STATE.style,
      zoom: this.INITIAL_VIEW_STATE.zoom,
      center: [
        this.INITIAL_VIEW_STATE.longitude,
        this.INITIAL_VIEW_STATE.latitude,
      ],
    });

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    map.addControl(this.draw);

    map.on('draw.delete', () => this.saveAllPolygons());
    map.on('draw.update', () => this.saveAllPolygons());
    map.on('draw.create', () => this.saveAllPolygons());
  }

  buildDisplayMap(data: any) {
    this.displayMap = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'display-map',
      style: this.INITIAL_VIEW_STATE.style,
      interactive: false,
      center: [
        this.INITIAL_VIEW_STATE.longitude,
        this.INITIAL_VIEW_STATE.latitude,
      ],
      zoom: this.INITIAL_VIEW_STATE.zoom,
      bearing: this.INITIAL_VIEW_STATE.bearing,
      pitch: this.INITIAL_VIEW_STATE.pitch,
    });

    // when map is loaded, create the deck to load data
    this.displayMap.on('load', () =>
      this.createDeckForMap(this.displayMap, [this.createColumnLayer(data)])
    );
  }

  // update the view with new data
  updateView(data: any) {
    const layers = [this.createColumnLayer(data)];
    this.deck.setProps({ layers: layers });
  }

  createColumnLayer(data: any) {
    return new ColumnLayer({
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
  }

  // created a deck for specified map, with passed in layers
  createDeckForMap(map: any, layers: any) {
    this.deck = new Deck({
      canvas: 'deck-canvas',
      width: '100%',
      height: '100%',
      style: { top: '0', left: '0' },
      initialViewState: this.INITIAL_VIEW_STATE,
      controller: true,
      // handles movement of mapbox map with canvas
      onViewStateChange: ({ viewState }: any) => {
        map.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch,
        });
      },
      getTooltip: ({ object }: any) => object && `value: ${object.value}`,
      layers: layers,
    });
  }

  // Gets polygons which exist currently in the global draw object, and sends notification
  saveAllPolygons = () => {
    var FeatureCollection = this.draw?.getAll();
    const polygons = [];
    for (let feature of FeatureCollection.features) {
      polygons.push([feature.geometry.coordinates[0]]);
    }
    this.polygonSubject.next(polygons);
  };

  // True if the given point is in given polygon
  isPointInPolygon(point: [], polygon: [[]]): boolean {
    var pt = turf.point(point);
    var poly = turf.polygon(polygon);
    const res = turf.booleanPointInPolygon(pt, poly);
    return res;
  }

  // Given the dataset, and the array of polygons filters the points inside the polygons, and updates the view
  filterDataByPolygons(data: any, polygons: any) {
    if (polygons.length !== 0) {
      const filtered = data.filter((x: any) => {
        for (let polygon of polygons) {
          if (this.isPointInPolygon(x.centroid, polygon)) return true;
        }
        return false;
      });
      this.updateView(filtered);
    } else {
      this.updateView(data);
    }
  }
}
