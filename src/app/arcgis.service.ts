import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collectionareas } from './collectionareas';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Geodata } from './geodata';

@Injectable({
  providedIn: 'root'
})
export class ArcgisService {

  constructor(private http: HttpClient) { }

  private geocodeUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates';

  getTrashDay(address): Observable<Geodata> {

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams()
      .append('Street', address).append('outSR', '2264')
      .append('f', 'json');

      
    return this.http.get<Geodata>(encodeURI(this.geocodeUrl));
  }

}
