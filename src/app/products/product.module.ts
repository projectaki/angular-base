import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductListGuard } from './product-list.guard';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  // A component can only be declared in 1 module
  declarations: [
    ProductListComponent
  ],
  // imports are for what the module is using
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id', component: ProductListComponent, canActivate: [ProductListGuard] },
    ]),
    SharedModule
  ],
  // any module that imports this module will be able to use whats in this modules export list
  exports: [
    ProductListComponent
  ]
})
export class ProductModule { }
