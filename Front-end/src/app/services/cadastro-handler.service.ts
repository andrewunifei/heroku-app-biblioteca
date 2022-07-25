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
export class CadastroHandlerService {
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  cadastrar_func(data): Observable<any>{
    return this.http.post<User>(baseUrl + 'cadastrar_func', data)
  }

  cadastrar_assoc(data): Observable<any>{
    return this.http.post<User>(baseUrl + 'cadastrar-assoc', data)
  }

  cadastrar_pub(data): Observable<any>{
    return this.http.post<any>(baseUrl + 'cadastrar-pub', data)
  }

  cadastrar_exemplar(data): Observable<any>{
    return this.http.post<any>(baseUrl + 'cadastrar-exemplar', data)
  }

  cadastrar_reserva(data): Observable<any>{
    return this.http.post<any>(baseUrl + 'cadastrar-reserva', data)
  }

  cadastrar_emprestimo(data): Observable<any>{
    return this.http.post<any>(baseUrl + 'cadastrar-emp', data)
  }

  devolucao(data): Observable<any>{
    return this.http.post<any>(baseUrl + 'devolucao', data)
  }
}
