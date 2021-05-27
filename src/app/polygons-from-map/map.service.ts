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

  map: any;
  deck: any;
  draw: any;

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
    this.map = new mapboxgl.Map({
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

    this.map.addControl(this.draw);
    let count = 0;
    this.map.on('draw.create', () => count++);
    this.map.on('draw.delete', () => count--);
    // map.on("draw.update", () => (isSubmitable = true));
  }

  updateDeckData(val: number) {
    // will be raplaced with data to update
    this.res$
      .pipe(
        map((data) => data.slice(0, val)),
        tap((data) => console.log(data))
      )
      .subscribe((data) => {
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
      this.deck.setProps({ layers: layers });
    });
  }

  buildDisplayMap() {
    this.res$.subscribe((data) => {
      const map = new mapboxgl.Map({
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

      const colLayer = new ColumnLayer({
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
        width: '90vw',
        height: '90vh',
        style: { left: '50%', transform: 'translate(-50%)' },
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
        layers: [colLayer],
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
