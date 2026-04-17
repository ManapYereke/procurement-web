import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {RequestService} from '../../core/service/request.service';

@Component({
  selector: 'app-request-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-create.html'
})
export class RequestCreateComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: RequestService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: [''],
      category: [''],
      maxPrice: [0],
      specifications: this.fb.array([])
    });
  }

  get specs(): FormArray {
    return this.form.get('specifications') as FormArray;
  }

  addSpec() {
    this.specs.push(
      this.fb.group({
        name: [''],
        operator: ['='],
        value: ['']
      })
    );
  }

  submit() {
    this.service.create(this.form.value).subscribe(() => {
      this.router.navigateByUrl('/').then();
    });
  }
}
