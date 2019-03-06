import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CityworksSrResponse } from './cityworks-sr-response';
import { Observable } from 'rxjs';
import { Options } from 'selenium-webdriver/edge';

@Injectable({
  providedIn: 'root'
})
export class CityworksService {

  constructor(private http: HttpClient) { }

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

  createServiceRequest(): Observable<CityworksSrResponse> {

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams()
      .append('token', this.token).append('data', JSON.stringify(this.body));

    return this.http.post<CityworksSrResponse>(this.createSRUrl, null, {
      headers,
      params
    });
  }

}
