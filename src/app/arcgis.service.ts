import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collectionareas } from './collectionareas';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArcgisService {

  constructor(private http: HttpClient) { }

  // getTrashDay(data): Observable<Collectionareas> {

  //   let geometry = JSON.stringify(data);

  //   return this.http.get(encodeURI(this.urlTrashDay + geometry + this.urlparms)).map((res: Response) => res.json())
  //     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  // }

}
