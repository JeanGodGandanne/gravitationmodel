import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ObjectWindowComponent } from './component/object-window.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';



@NgModule({
  declarations: [ObjectWindowComponent],
  exports: [
    ObjectWindowComponent
  ],
    imports: [
        CommonModule,
        BrowserModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
    ]
})
export class ObjectWindowModule { }
