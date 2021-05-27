import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MapService } from './map.service';

@Component({
  selector: 'pm-polygons-from-map',
  templateUrl: './polygons-from-map.component.html',
  styleUrls: ['./polygons-from-map.component.css'],
})
export class PolygonsFromMapComponent implements OnInit, OnDestroy {
  filtered$ = this.mapService.filteredData$;
  subs: Subscription = new Subscription();

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.subs.add(this.filtered$.subscribe());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngAfterViewInit() {}

  savePolygons() {
    this.mapService.saveAllPolygons();
  }
}
