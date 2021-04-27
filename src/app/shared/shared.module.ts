import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// The shared module is imported by every feature module, therefore components, directives, and pipes which are commonly reused
// should go in the shared module. Also we can re-export commonly used modules so they are available in the feature modules.
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
