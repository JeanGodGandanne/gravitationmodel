import { Injectable } from '@angular/core';
import {FeatureProperties} from '../layer/einzugsgebiete/ezb.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectWindowService {
  objectWindowCurrentState = ObjectWindowState.CLOSED;

  isObjectWindowVisible = false;

  // TODO change to observable to emit changes in object window
  currentlySelectedFeature: BehaviorSubject<FeatureProperties> = new BehaviorSubject<FeatureProperties>(null);

  public changeCurrentlySelectedFeature(featureProperties: FeatureProperties): void {
    this.currentlySelectedFeature.next(featureProperties);
  }

}

export enum ObjectWindowState {
  OPEN = 'open',
  CLOSED = 'closed'
}
