import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectWindowService {
  objectWindowCurrentState = ObjectWindowState.CLOSED;

  isObjectWindowVisible = false;

  currentlySelectedFiliale: number | string;

}

export enum ObjectWindowState {
  OPEN = 'open',
  CLOSED = 'closed'
}
