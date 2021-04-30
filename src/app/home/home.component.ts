import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('honeref') vc!: ElementRef;
  elem!: HTMLElement;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.elem = this.vc.nativeElement;
    this.elem.innerHTML = 'neeeeew';
  }
}
