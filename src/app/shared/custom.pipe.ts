import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custom',
})
export class CustomPipe implements PipeTransform {
  // value => input parameter
  transform(value: string): string {
    return 'transformed';
  }
}
