import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomPipe } from './custom.pipe';
import { CodeExampleComponent } from './code-example/code-example.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

// The shared module is imported by every feature module, therefore components, directives, and pipes which are commonly reused
// should go in the shared module. Also we can re-export commonly used modules so they are available in the feature modules.
@NgModule({
  declarations: [CustomPipe, CodeExampleComponent],
  imports: [CommonModule, HighlightModule],
  exports: [CommonModule, FormsModule, CustomPipe, CodeExampleComponent],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      },
    },
  ],
})
export class SharedModule {}
