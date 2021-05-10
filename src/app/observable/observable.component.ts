import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { from, fromEvent, Observable, of, range, Subscription } from 'rxjs';
import { map, filter, tap, take } from 'rxjs/operators';

@Component({
  selector: 'pm-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.css'],
})
export class ObservableComponent implements OnInit {
  stream!: Observable<number>;
  subs: Subscription = new Subscription();
  @ViewChild('but') butRef!: ElementRef;
  constructor() {}

  ngOnInit(): void {
    const observer = {
      next: (msg: any) => console.log(msg),
      error: (err: any) => console.log(err),
      complete: () => console.log('done'),
    };

    this.stream = new Observable<number>((observer) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).pipe(
      // manipulate values in the observable stream
      map((item) => item * 2), // apply operation o every item
      tap((item) => console.log('tap', item)), // listen in on the stream, (used for debugging)
      take(2) // take top 2 from stream
    );

    const functionStream = of(1, 2, 3).pipe(map((item) => item * 2));
    const functionStream2 = from(['msg1']);

    this.subs.add(
      this.stream.subscribe(
        (msg: any) => console.log(msg),
        (err: any) => console.log(err),
        () => console.log('done')
      )
    );
  }

  ngAfterViewInit() {
    fromEvent(this.butRef.nativeElement, 'click').subscribe((x) =>
      console.log('here')
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  clickHandler = () => {
    this.subs.add(
      this.stream.subscribe(
        (msg: any) => console.log(msg),
        (err: any) => console.log(err),
        () => console.log('done')
      )
    );
  };
}
