import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularformsComponent } from './angularforms/angularforms.component';
import { RouterModule } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AngularformsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'forms', component: AngularformsComponent },
    ]),
    ReactiveFormsModule,
  ],
})
export class AngularFormsModule {}
