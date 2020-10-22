import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BaseMapComponent} from './component/base-map.component';



@NgModule({
  declarations: [BaseMapComponent],
  exports: [
    BaseMapComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BaseMapModule { }
