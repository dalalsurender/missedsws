import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { LocatorResponse } from './locator-response';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArcgisService {

  constructor(private http: HttpClient) { }

  private geocodeUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates';

  geocode(address): Observable<LocatorResponse> {

    // Headers not needed b/c HttpParams assumes x-www-form-urlencoded
    //
    // const headers = new HttpHeaders()
    //   .append('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams()
      .append('Street', address).append('outSR', '2264')
      .append('f', 'json');

    return this.http.get<LocatorResponse>(this.geocodeUrl, {
      // headers,
      params
    }).pipe(
      catchError(this.handleError));
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
