import { Injectable } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: any;
  draw: any;
  style = 'mapbox://styles/mapbox/dark-v10';
  lat = 45.899977;
  lng = 6.172652;
  zoom = 12

  constructor() {}

  buildMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    })

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      
    });

    this.map.addControl(this.draw);
    
  }

//   let count = 0;
// map.on("draw.create", () => count++);
// map.on("draw.delete", () => count--);
// // map.on("draw.update", () => (isSubmitable = true));

// const getAllPolygons = (e) => {
//   var FeatureCollection = draw.getAll();
//   const polygons = [];
//   for (let feature of FeatureCollection.features) {
//     polygons.push(feature.geometry.coordinates[0]);
//   }
//   return polygons;
// };

// // submit click handler method
// const mouseClickHandler = async () => {
//   const polygons = await getAllPolygons();
//   //connect();
//   //ExecQuery();
//   //console.log(polygons);
// };

// // set onclick function for submit button
// const submitButton = document.getElementById("submit-data");
// submitButton.onclick = mouseClickHandler;

// const isInsidePolygon = (point, polygonCoordinates) => {
//   const [long, lat] = point;
//   point = turf.point([long, lat]);

//   var polygon = turf.polygon([polygonCoordinates], { name: "poly1" });
//   const isIn = turf.inside(point, polygon);
//   console.log(polygon);
// };

// const saveToSql = (coordsArray) => {
//   isInsidePolygon([5, 5], coordsArray);
// };

  
}
