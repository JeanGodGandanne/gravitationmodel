import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfoBoxService {

  infoBoxCurrentState = InfoBoxState.CLOSED;

  isInfoBoxVisible = false;

}

export enum InfoBoxState {
  OPEN = 'open',
  CLOSED = 'closed'
}
