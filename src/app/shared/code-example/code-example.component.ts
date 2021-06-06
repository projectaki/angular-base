import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pm-code-example',
  templateUrl: './code-example.component.html',
  styleUrls: ['./code-example.component.css'],
})
export class CodeExampleComponent implements OnInit {
  code = `import { Component, OnInit } from '@angular/core';

  @Component({
    selector: 'pm-code-example',
    templateUrl: './code-example.component.html',
    styleUrls: ['./code-example.component.css'],
  })
  export class CodeExampleComponent implements OnInit {

    constructor() {}
  
    ngOnInit(): void {}
  }`;
  constructor() {}

  ngOnInit(): void {}
}
