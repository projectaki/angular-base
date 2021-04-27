import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonsFromMapComponent } from './polygons-from-map.component';

describe('PolygonsFromMapComponent', () => {
  let component: PolygonsFromMapComponent;
  let fixture: ComponentFixture<PolygonsFromMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolygonsFromMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonsFromMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
