import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models';

const baseUrl = 'http://localhost:8080/api/'
@Injectable({
  providedIn: 'root'
})
export class ConsultarHandlerService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  consultar_pub(data): Observable<any>{
    return this.http.post<User>(baseUrl + '/consultar-pub', data)
  }

}
