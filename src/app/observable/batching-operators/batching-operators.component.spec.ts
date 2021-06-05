import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchingOperatorsComponent } from './batching-operators.component';

describe('BatchingOperatorsComponent', () => {
  let component: BatchingOperatorsComponent;
  let fixture: ComponentFixture<BatchingOperatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchingOperatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchingOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
