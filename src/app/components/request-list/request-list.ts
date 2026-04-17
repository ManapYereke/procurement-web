import {Component, signal} from '@angular/core';
import {RequestService} from '../../core/service/request.service';
import {RouterLink} from '@angular/router';
import {Request} from '../../models/request.model';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './request-list.html',
  styleUrl: './request-list.scss',
})
export class RequestListComponent {
  displayedColumns = ['title', 'category', 'maxPrice', 'status'];

  data = signal<Request[]>([]);
  loading = signal(false);

  page = signal(0);
  size = signal(10);
  total = signal(0);

  constructor(private service: RequestService) {
    this.load();
  }

  load() {
    this.loading.set(true);

    this.service.getPage({page: this.page(), size: this.size()})
      .subscribe(res => {
        this.data.set(res.content);
        this.total.set(res.totalElements);
        this.loading.set(false);
      });
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.size.set(event.pageSize);
    this.load();
  }
}
