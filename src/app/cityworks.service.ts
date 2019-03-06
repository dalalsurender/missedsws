import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CityworksSrResponse } from './cityworks-sr-response';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CityworksAuthResponse } from './cityworks-auth-response';

@Injectable({
  providedIn: 'root'
})
export class CityworksService {

  constructor(private http: HttpClient) { }

  // private cwAuthUrl = 'http://cworkprdappwv1/admin/services/Ams/Authentication/Authenticate?data={%22LoginName%22:%22cwsoa%22,%22Password%22:%22cwsoa1%22}';
  private cwAuthUrl = 'https://cityworkstest.raleighnc.gov/cityworkstest/services/Ams/Authentication/Authenticate?data={%22LoginName%22:%22coraleigh/cwsoa%22,%22Password%22:%22Z3%40b741M%23r%21%22}';
  login = { "LoginName": "coraleigh/cwsoa", "Password": "Z3%40b741M%23r%21" };

  private createSRUrl = 'http://cworkprdappwv1/admin/Services/AMS/ServiceRequest/Create';
  private token = 'eyJFbXBsb3llZVNpZCI6MjY1MTk2LCJJc3N1ZWRUaW1lIjoxNTUxNzM2MTEwOTYyLCJMb2dpbk5hbWUiOiJDV1NPQSIsIlNpZ25hdHVyZSI6IlFDMWNrN1kwWlUyZEdOejVuTHM4c21HZnIxaVhGcHR2V0xYc2NrL05PUWc9IiwiVG9rZW4iOiJ2aVB2YjhJVUEycWphSEl5Yk01NlB4ekhTUWU2M3pVT0xDQ2xMbjl0U0tFPSJ9';
  private body = {
    callerAddress: '2618 YELLOW PINE RD, RALEIGH, 27616',
    callerCity: 'Raleigh',
    callerState: 'NC',
    callerWorkPhone: '5853558382',
    callerEmail: 'sardeenz@gmail.com',
    ProblemSid: '263551',
    x: '-78.50747221027551',
    y: '35.90239706858521',
    submitTo: 263755,
    address: '2618 YELLOW PINE RD, RALEIGH, 27616',
    comments: 'We moved and started service on 2/28/2019. We don\'t have garbage and recycle bins yet.',
  };

  getToken(): Observable<CityworksAuthResponse> {
    const params = new HttpParams()
      .append('data', JSON.stringify(this.login));

    return this.http.post<CityworksAuthResponse>(this.cwAuthUrl, null, {
      params
    }).pipe(
      catchError(this.handleError));
  }

  createServiceRequest(): Observable<CityworksSrResponse> {

    const params = new HttpParams()
      .append('token', this.token).append('data', JSON.stringify(this.body));

    // body parameter is null since all data is in url parameters aka HttpParams
    return this.http.post<CityworksSrResponse>(this.createSRUrl, null, {
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
