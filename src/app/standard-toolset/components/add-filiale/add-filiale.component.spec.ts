import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFilialeComponent } from './add-filiale.component';

describe('AddFilialeComponent', () => {
  let component: AddFilialeComponent;
  let fixture: ComponentFixture<AddFilialeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFilialeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFilialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
