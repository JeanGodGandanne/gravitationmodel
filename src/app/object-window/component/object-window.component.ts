import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule} from '@angular/common';
import {ObjectWindowService, ObjectWindowState} from '../object-window.service';
import {EzbService, FeatureProperties, FeatureTypeEnum} from '../../layer/einzugsgebiete/ezb.service';

@Component({
  selector: 'app-object-window',
  templateUrl: './object-window.component.html',
  styleUrls: ['./object-window.component.scss']
})
export class ObjectWindowComponent implements OnInit {

  currentlySelectedFeature: FeatureProperties;

  constructor(public readonly objectWindowService: ObjectWindowService,
              private readonly ezbService: EzbService) {
    objectWindowService.currentlySelectedFeature.subscribe(props => this.currentlySelectedFeature = props);
  }

  public featureTypeEnum = FeatureTypeEnum;


  ngOnInit(): void {
  }

  calculateGravitationModelForFiliale(): void {
    this.ezbService.calculateHuffModel(this.currentlySelectedFeature.properties.id as number);
  }

  closeObjectWindow(): void {
    this.objectWindowService.changeCurrentlySelectedFeature(null);
    this.objectWindowService.isObjectWindowVisible = !this.objectWindowService.isObjectWindowVisible;
    this.objectWindowService.objectWindowCurrentState === ObjectWindowState.OPEN ?
      this.objectWindowService.objectWindowCurrentState = ObjectWindowState.CLOSED :
      this.objectWindowService.objectWindowCurrentState = ObjectWindowState.OPEN;
  }
}
