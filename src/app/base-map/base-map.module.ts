import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BaseMapComponent} from './component/base-map.component';
import {HttpClientModule} from '@angular/common/http';
import {SelectFeatureService} from './select-feature.service';
import {BaseMapService} from './base-map.service';



@NgModule({
  declarations: [BaseMapComponent],
  exports: [
    BaseMapComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [SelectFeatureService, BaseMapService]
})
export class BaseMapModule { }
