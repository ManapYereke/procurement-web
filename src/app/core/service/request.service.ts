import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Request} from '../../models/request.model';
import {catchError, Observable} from 'rxjs';
import {handleError} from './helper';
import {Page, Pageable} from '../../shared/page.model';

@Injectable({providedIn: 'root'})
export class RequestService {

  private readonly api = '/api/requests';

  constructor(private http: HttpClient) {
  }

  getPage(pageable?: Pageable) {
    return this.http.get<Page<Request>>(this.api, {params: {...pageable}}).pipe(
      catchError(handleError)
    );
  }

  getById(id: string): Observable<Request> {
    return this.http.get<Request>(`${this.api}/${id}`).pipe(
      catchError(handleError)
    );
  }

  create(dto: any): Observable<Request> {
    return this.http.post<Request>(this.api, dto).pipe(
      catchError(handleError)
    );
  }

  startMatching(id: string): Observable<any> {
    return this.http.post(`${this.api}/${id}/match`, {}).pipe(
      catchError(handleError)
    );
  }
}
