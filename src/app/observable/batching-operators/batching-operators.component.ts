import { Component, OnInit } from '@angular/core';
import { interval, of } from 'rxjs';
import {
  buffer,
  bufferCount,
  bufferTime,
  bufferToggle,
  bufferWhen,
  mergeMap,
  switchMap,
  take,
  tap,
  toArray,
  window,
  windowCount,
  windowTime,
} from 'rxjs/operators';

@Component({
  selector: 'pm-batching-operators',
  templateUrl: './batching-operators.component.html',
  styleUrls: ['./batching-operators.component.css'],
})
export class BatchingOperatorsComponent implements OnInit {
  methodContainer: any[] = [];

  ngOnInit(): void {
    this.methodContainer.push(
      ...[
        this.buffer,
        this.bufferCount,
        this.bufferTime,
        this.bufferToggle,
        this.bufferWhen,
        this.window,
        this.windowCount,
        this.windowTime,
      ]
    );
  }

  //BUFFER operators return arrays

  // Buffer emits values from the source observable when a notification observaable emits
  buffer() {
    interval(100)
      .pipe(buffer(interval(1000)), take(3))
      .subscribe((x) => console.log(x));
  }
  // @first param => buffer size, @second param (optional) => start new buffer after param length
  bufferCount() {
    of(1, 2, 3, 4, 5, 6)
      .pipe(bufferCount(2, 1))
      .subscribe((x) => console.log(x));
  }

  // @first param => emit every 2 seconds, create new buffer every 1 second
  bufferTime() {
    interval(100)
      .pipe(bufferTime(2000, 1000), take(3))
      .subscribe((x) => console.log(x));
  }

  // We define the batch opening and closing parameters

  bufferToggle() {
    const opening = interval(400);
    const closing = () => interval(300);

    interval(100)
      .pipe(bufferToggle(opening, closing), take(3))
      .subscribe((x) => console.log(x));
  }

  // we pass in a factory function, which can dynamically return when the notification should emit to close the batch
  // We cannot skip any elements, a new batch opens imidiatly after one closes
  bufferWhen() {
    interval(500)
      .pipe(
        take(10),
        bufferWhen(() => {
          return interval(1000);
        })
      )
      .subscribe((x) => console.log(x));
  }

  // same behaviour as buffer but emits observable instead of array
  window() {
    interval(100)
      .pipe(
        window(interval(1000)),
        // tap((x) => console.log('next')),
        switchMap((x) => x.pipe(toArray())),
        take(3)
      )
      .subscribe((x) => console.log(x));
  }

  windowCount() {
    of(1, 2, 3, 4, 5, 6)
      .pipe(
        windowCount(2, 1),
        mergeMap((x) => x.pipe(toArray()))
      )
      .subscribe((x) => console.log(x));
  }

  windowTime() {
    interval(100)
      .pipe(
        take(9),
        windowTime(200, 100),

        mergeMap((x) => x.pipe(toArray()))
      )
      .subscribe((x) => console.log(x));
  }
}
