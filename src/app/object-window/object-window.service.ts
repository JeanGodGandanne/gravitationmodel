import { Injectable } from '@angular/core';
import {FilialeProperties, ZensusProperties} from '../layer/einzugsgebiete/feature.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectWindowService {
  objectWindowCurrentState = ObjectWindowState.CLOSED;

  isObjectWindowVisible = false;

  currentlySelectedFeature: BehaviorSubject<FilialeProperties | ZensusProperties> = new BehaviorSubject<FilialeProperties | ZensusProperties>(null);

  public changeCurrentlySelectedFeature(featureProperties: FilialeProperties | ZensusProperties): void {
    this.currentlySelectedFeature.next(featureProperties);
  }

}

export enum ObjectWindowState {
  OPEN = 'open',
  CLOSED = 'closed'
}
