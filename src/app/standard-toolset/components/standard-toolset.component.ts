import { Component, ElementRef, HostListener } from '@angular/core';
import { StandardToolsetEnum } from '../model/standard-toolset.enum';
import { By } from '@angular/platform-browser';
import {expand} from '../../animations';

@Component({
    selector: 'app-standard-toolset',
    templateUrl: './standard-toolset.component.html',
    styleUrls: ['./standard-toolset.component.scss'],
    animations: [expand]
})
export class StandardToolsetComponent {
  public StandardToolsetEnum = StandardToolsetEnum;
  public activeTool: StandardToolsetEnum = null;

  // insert tool here if it should be closed on outside click
  private closeToolOnOutsideClickArray: StandardToolsetEnum[] = [
    StandardToolsetEnum.LAYER_MANAGER,
  ];

  constructor(private elementRef: ElementRef) {
  }

  /**
   * Close a subset of tools if its active and user clicks on outside the standard toolset (e.g. in/on the map).
   */
  @HostListener('document:click', ['$event'])
  clickOnMap(event: MouseEvent): void {
    if (this.closeToolOnOutsideClickArray.includes(this.activeTool)
      && this.clickedOutsideToolBar(event)
      && this.clickedOutsideAnimationContainer(event)
    ) {
      this.onToolButtonClick(this.activeTool);
    }
  }

  private clickedOutsideToolBar(event: MouseEvent): boolean {
    const elementRefDOMRect = this.elementRef.nativeElement.getBoundingClientRect();
    return event.y < elementRefDOMRect.top
      || event.y > elementRefDOMRect.bottom
      || event.x < elementRefDOMRect.left
      || event.x > elementRefDOMRect.right;
  }

  private clickedOutsideAnimationContainer(event: MouseEvent): boolean {
    const animationContainerElement = this.elementRef.nativeElement.getElementsByClassName('animation-container')[0];
    if (animationContainerElement) {
      const elementRefDOMRect = animationContainerElement.getBoundingClientRect();
      return event.y < elementRefDOMRect.top
        || event.y > elementRefDOMRect.bottom
        || event.x < elementRefDOMRect.left
        || event.x > elementRefDOMRect.right;
    } else {
      return false;
    }
  }

  /**
   * Checks after click if the currently active tool was clicked again.
   * If yes, close the tool. If not, open the new one.
   */
  onToolButtonClick(standardToolsetEnum: StandardToolsetEnum): void {
    if (this.activeTool === standardToolsetEnum) {
      this.activeTool = null;
    } else {
      this.activeTool = standardToolsetEnum;
    }
  }
}
