import { Routes } from '@angular/router';
import {RequestListComponent} from './components/request-list/request-list';
import {RequestCreateComponent} from './components/request-create/request-create';
import {RequestDetailComponent} from './components/request-detail/request-detail';

export const routes: Routes = [
  { path: '', component: RequestListComponent },
  { path: 'create', component: RequestCreateComponent },
  { path: 'request/:id', component: RequestDetailComponent }
];
