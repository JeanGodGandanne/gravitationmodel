import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectWindowComponent } from './object-window.component';

describe('ObjectWindowComponent', () => {
  let component: ObjectWindowComponent;
  let fixture: ComponentFixture<ObjectWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
