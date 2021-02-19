import {Component, OnInit} from '@angular/core';
import {ObjectWindowService, ObjectWindowState} from '../object-window.service';
import {FeatureService, FeatureTypeEnum, FilialeProperties, ZensusProperties} from '../../layer/einzugsgebiete/feature.service';

@Component({
  selector: 'app-object-window',
  templateUrl: './object-window.component.html',
  styleUrls: ['./object-window.component.scss']
})
export class ObjectWindowComponent implements OnInit {


  constructor(public readonly objectWindowService: ObjectWindowService,
              private readonly featureService: FeatureService) {
  }

  public featureTypeEnum = FeatureTypeEnum;


  ngOnInit(): void {
  }

  calculateGravitationModelForFiliale(id: number): void {
    this.featureService.calculateHuffModel(id);
  }

  closeObjectWindow(): void {
    this.objectWindowService.changeCurrentlySelectedFeature(null);
    this.objectWindowService.isObjectWindowVisible = !this.objectWindowService.isObjectWindowVisible;
    this.objectWindowService.objectWindowCurrentState === ObjectWindowState.OPEN ?
      this.objectWindowService.objectWindowCurrentState = ObjectWindowState.CLOSED :
      this.objectWindowService.objectWindowCurrentState = ObjectWindowState.OPEN;
  }

  updateFeature(feature: FilialeProperties | ZensusProperties): void {
    this.objectWindowService.changeCurrentlySelectedFeature(feature);
  }
}
