import {Component, Signal, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RequestService } from '../../core/service/request.service';
import { OfferService } from '../../core/service/offer.service';

import { Request } from '../../models/request.model';
import { Offer } from '../../models/offer.model';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './request-detail.html'
})
export class RequestDetailComponent {

  requestId: string; request: Signal<Request | null>;

  // offers как writable signal
  offers = signal<Offer[]>([]);

  loading = signal(false);

  displayedColumns: string[] = [
    'supplierName',
    'productName',
    'price',
    'specifications'
  ];

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private offerService: OfferService
  ) {
    this.requestId = this.route.snapshot.paramMap.get('id')!;
    this.request = toSignal( this.requestService.getById(this.requestId), { initialValue: null } );
    this.loadOffers();
  }

  loadOffers() {
    this.loading.set(true);

    this.offerService.getByRequestId(this.requestId)
      .subscribe({
        next: (res) => {
          this.offers.set(res);
          this.loading.set(false);
        },
        error: () => {
          this.offers.set([]);
          this.loading.set(false);
        }
      });
  }

  startMatching() {
    this.loading.set(true);

    this.requestService.startMatching(this.requestId)
      .subscribe({
        next: () => {
          // простой polling после обработки NATS
          setTimeout(() => this.loadOffers(), 2000);
        },
        error: () => this.loading.set(false)
      });
  }
}
