import { NgModule } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { StandardToolsetComponent } from './components/standard-toolset.component';
import { LayerManagerComponent } from './components/layer-manager/layer-manager.component';
import { AddFilialeComponent } from './components/add-filiale/add-filiale.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    StandardToolsetComponent,
    LayerManagerComponent,
    AddFilialeComponent
  ],
  exports: [
    StandardToolsetComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    KeyValuePipe
  ]
})
export class StandardToolsetModule {
}
