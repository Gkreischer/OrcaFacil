import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from  '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';




@Injectable()
export class CrudService {

  API_URL: string = 'http://localhost:3000/api';
  constructor(public http: HttpClient) { }

  criarRegistro(form, rota: string): Observable<any> {
    return this.http.put(this.API_URL + rota, form).pipe(
      catchError(this.handleError)
    );
  }

  lerRegistro(rota): Observable<any> {
    return this.http.get(this.API_URL + rota).pipe(
      catchError(this.handleError)
    );
  }

  lerRegistroEspecifico(rota, id): Observable<any> {
    return this.http.get(this.API_URL + rota + '/'+ id).pipe(
      catchError(this.handleError)
    );
  }

  deletaRegistro(rota, id): Observable<any> {
    return this.http.delete(this.API_URL + rota + '/' + id).pipe(
      catchError(this.handleError)
    );
  }

  // Tratamento de erro
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('Um erro ocorreu', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend retornou a msg ${error.status}, ` +
        `body era: ${JSON.stringify(error.error)}`);
    }
    // return an observable with a user-facing error message
    return ErrorObservable.create('Nos desculpe. Tente novamente mais tarde,')
  };
}
