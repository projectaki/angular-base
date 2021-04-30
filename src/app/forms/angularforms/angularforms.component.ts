import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'pm-angularforms',
  templateUrl: './angularforms.component.html',
  styleUrls: ['./angularforms.component.css'],
})
export class AngularformsComponent implements OnInit {
  profileForm!: FormGroup;
  constructor() {}

  ngOnInit(): void {
    let firstName = new FormControl(['akos', 'aki']);
    let lastName = new FormControl('second');

    this.profileForm = new FormGroup({
      firstName: firstName,
      lastName: lastName,
    });
  }
}
