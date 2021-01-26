import { Injectable } from '@angular/core';
import {FeatureProperties} from '../layer/einzugsgebiete/ezb.service';

@Injectable({
  providedIn: 'root'
})
export class ObjectWindowService {
  objectWindowCurrentState = ObjectWindowState.CLOSED;

  isObjectWindowVisible = false;

  // TODO change to observable to emit changes in object window
  currentlySelectedFeature: FeatureProperties;

}

export enum ObjectWindowState {
  OPEN = 'open',
  CLOSED = 'closed'
}
