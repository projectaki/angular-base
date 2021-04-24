import { Component, OnInit } from '@angular/core';
import { Observable, range } from 'rxjs';
import { map, filter } from 'rxjs/operators'; 

@Component({
  selector: 'pm-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.css']
})
export class ObservableComponent implements OnInit {
  source$: Observable<number> = range(0, 10);

  constructor() { }

  ngOnInit(): void {
    this.useOperators(this.source$);
  }

  useOperators = (source: Observable<number>) => {
    source.pipe(
      map(x => x*3),
      filter(x => x % 2 === 0)
    ).subscribe(x => console.log(x));
  }

}
