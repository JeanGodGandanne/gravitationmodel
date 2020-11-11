import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectWindowComponent } from './component/object-window.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [ObjectWindowComponent],
  exports: [
    ObjectWindowComponent
  ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class ObjectWindowModule { }
