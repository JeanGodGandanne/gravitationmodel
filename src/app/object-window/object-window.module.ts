import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectWindowComponent } from './component/object-window.component';



@NgModule({
  declarations: [ObjectWindowComponent],
  exports: [
    ObjectWindowComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ObjectWindowModule { }
