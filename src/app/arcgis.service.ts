import { Injectable } from '@angular/core';
import { Observable, throwError, GroupedObservable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { GeoResponse } from './geo-response';
import { Collectionareas } from './collectionareas';
import { WorldGeoResponse } from './world-geo-response';

@Injectable({
  providedIn: 'root'
})
export class ArcgisService {
  coordinates: any;

  constructor(private http: HttpClient) { }

  // private esriWorldLocatorUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';
  private geocodeUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates';
  private esriWorldLocatorUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
  private trashDayUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Services/PortalServices/MapServer/12/query';
  collectionAreaExtent = {
    xmin: 2054330.92561337,
    ymin: 715987.374691591,
    xmax: 2148717.34515728,
    ymax: 808419.684537664,
    spatialReference: {
      wkid: 2264
    }
  };

  geocodeRal(address): any {
    const params = new HttpParams()
      .append('Street', address).append('outSR', '2264')
      .append('f', 'json');

    return this.http.get<any>(this.geocodeUrl, {
      params
    }).pipe(map((coords) => console.log('inside geocode service', this.coordinates = coords)));
    // catchError(this.handleError));
  }

  // geocodeRal(address): Observable<GeoResponse> {
  //   const params = new HttpParams()
  //     .append('Street', address).append('outSR', '2264')
  //     .append('f', 'json');

  //   return this.http.get<GeoResponse>(this.geocodeUrl, {
  //     params
  //   }).pipe(
  //     catchError(this.handleError));
  // }

  geocode(address): Observable<GeoResponse> {
    const params = new HttpParams()
      .append('SingleLine', address).append('category', 'Address').append('searchExtent', JSON.stringify(this.collectionAreaExtent))
      .append('f', 'json');

    return this.http.get<GeoResponse>(this.esriWorldLocatorUrl, {
      params
    }).pipe(
      catchError(this.handleError));
  }

  getTrashDay(geometry): Observable<Collectionareas> {
    const geometryStr = JSON.stringify(geometry);
    const params = new HttpParams()
      .append('geometry', geometryStr).append('geometryType', 'esriGeometryPoint')
      .append('inSR', '2264').append('outFields', 'WEEK, DAY').append('returnGeometry', 'false').append('f', 'json');

    return this.http.get<Collectionareas>(this.trashDayUrl, {
      params
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
