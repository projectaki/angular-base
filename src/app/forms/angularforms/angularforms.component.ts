import { Options } from '@angular-slider/ngx-slider';
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
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'pm-angularforms',
  templateUrl: './angularforms.component.html',
  styleUrls: ['./angularforms.component.css'],
})
export class AngularformsComponent implements OnInit {
  profileForm!: FormGroup;
  // error string which we can bind to for display
  firstNameErrorMsgs: string[] = [];
  subscriptions!: Subscription;
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
    this.subscriptions = new Subscription();
    // this.profileForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    // });
    this.profileForm = this.fb.group({
      names: this.fb.array([this.buildFormGroup()]),
      age: '',
    });
    //this.profileForm.patchValue({ firstName: 'temp' });

    this.subscribeToValueChange(0);
  }

  ngOnDestroy = () => {
    // avoid memory leak
    this.subscriptions.unsubscribe();
  };

  // given an index, grabs the control at that index and subscribes to the value changes of that control
  subscribeToValueChange = (index: number) => {
    const cont = this.names.get(`${index}.firstName`);

    // console.log(fn.get('firstName'));
    const sub = cont?.valueChanges // .pipe(debounceTime(1000)) // delay before validation error displays (gives to type correct info)
      .subscribe((value) => {
        // when there is new value event in obsservable do something
        this._updateMsgAtIndex(cont, index);
        console.log(index);
      });
    this.subscriptions.add(sub);
  };

  // takes the passed control, does the error checks, and asigns the binded error msg, index is passed for updating error message in errorMsg Array
  _updateMsgAtIndex = (c: AbstractControl, index: number): void => {
    this.firstNameErrorMsgs[index] = '';
    if (c.errors) {
      this.firstNameErrorMsgs[index] = Object.keys(c.errors)
        .map((key) => this.validationMessages[key])
        .join(' ');
    }
  };

  // change validotors as needed within code
  dynamicallyChangeValidatorsHandler = () => {
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
        [customValidator(3), Validators.required],
      ],
    });
  };

  addGroupHandler = () => {
    this.names.push(this.buildFormGroup());
    this.subscribeToValueChange(this.names.length - 1);
  };

  deleteGroupHandler = (index: number) => {
    this.names.removeAt(index);
    this._resetSubs();
  };

  // when deleting a control, the subscriptions have to be rerun, because the indexes shift with deletion
  _resetSubs = () => {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    for (let i = 0; i < this.names.length; i++) {
      this.subscribeToValueChange(i);
    }
  };
}
// OUTSIDE FUNCTION => SEPERATE FILE FOR CUSTOM VALIDATORS
// to be able to pass parameters to the cutom validator, we need to wrap it and return9
const customValidator = (max: number): ValidatorFn => {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value > max) {
      return { length: true };
    }
    return null;
  };
};
