import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BaseMapModule} from './base-map/base-map.module';
import {LayerModule} from './layer/layer.module';
import {InfoBoxModule} from './info-box/info-box.module';
import {ObjectWindowModule} from './object-window/object-window.module';
import {StandardToolsetModule} from './standard-toolset/standard-toolset.module';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        BaseMapModule,
        LayerModule,
        InfoBoxModule,
        ObjectWindowModule,
        StandardToolsetModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
