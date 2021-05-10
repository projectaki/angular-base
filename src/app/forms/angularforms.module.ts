import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularformsComponent } from './angularforms/angularforms.component';
import { RouterModule } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [AngularformsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'forms', component: AngularformsComponent },
    ]),
    ReactiveFormsModule,
    NgxSliderModule,
  ],
})
export class AngularFormsModule {}
