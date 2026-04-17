import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Offer} from '../../models/offer.model';
import {catchError} from 'rxjs';
import {handleError} from './helper';

@Injectable({ providedIn: 'root' })
export class OfferService {

  private api = '/api/offers';

  constructor(private http: HttpClient) {}

  getByRequestId(requestId: string) {
    return this.http.get<Offer[]>(
      `${this.api}/by-request/${requestId}`
    ).pipe(
      catchError(handleError)
    );
  }
}
