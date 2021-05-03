import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'pm-angularforms',
  templateUrl: './angularforms.component.html',
  styleUrls: ['./angularforms.component.css'],
})
export class AngularformsComponent implements OnInit {
  profileForm!: FormGroup;
  // error string which we can bind to for display
  firstNameErrorMsg!: string;
  // validation message array (from external source)
  private validationMessages: { [key: string]: string } = {
    required: 'Enter required field',
    length: 'improper length',
  };

  get names(): FormArray {
    return <FormArray>this.profileForm.get('names');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // this.profileForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    // });
    this.profileForm = this.fb.group({
      names: this.fb.array([this.buildFormGroup()]),
      age: '',
    });
    //this.profileForm.patchValue({ firstName: 'temp' });

    // subscribe to changes, and set
    const cont = this.names.get('0.firstName');

    // console.log(fn.get('firstName'));
    cont?.valueChanges // .pipe(debounceTime(1000)) // delay before validation error displays (gives to type correct info)
      .subscribe((value) => {
        this.setMsg(cont);
      });
  }

  // takes the passed control, does the error checks, and asigns the binded error msg
  setMsg = (c: AbstractControl): void => {
    this.firstNameErrorMsg = '';
    if (c.errors) {
      this.firstNameErrorMsg = Object.keys(c.errors)
        .map((key) => this.validationMessages[key])
        .join(' ');
    }
  };

  // change validotors as needed within code
  dynamicallyChangeValidators = () => {
    const lastNameControl = this.profileForm.get('names.lastName');
    lastNameControl?.setValidators(Validators.required);
    //lastNameControl?.clearValidators();
    lastNameControl?.updateValueAndValidity();
  };

  buildFormGroup = (): FormGroup => {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      lastName: [
        { value: '', disabled: false },
        [validatorWrapper(3), Validators.required],
      ],
    });
  };

  addNames = () => {
    this.names.push(this.buildFormGroup());
  };
}
// OUTSIDE FUNCTION => SEPERATE FILE FOR CUSTOM VALIDATORS
// to be able to pass parameters to the cutom validator, we need to wrap it and return9
const validatorWrapper = (max: number): ValidatorFn => {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value > max) {
      return { length: true };
    }
    return null;
  };
};
