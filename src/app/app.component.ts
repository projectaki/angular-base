import { Component } from "@angular/core";

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle: string = "Title";

  // consumes the return of the callback function from child
  getDataFromChild = (msg: string) => {
    console.log(msg);
  }
}