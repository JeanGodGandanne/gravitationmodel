import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectWindowService {
  objectWindowCurrentState = ObjectWindowState.CLOSED;

  isObjectWindowVisible = false;

}

export enum ObjectWindowState {
  OPEN = 'open',
  CLOSED = 'closed'
}
