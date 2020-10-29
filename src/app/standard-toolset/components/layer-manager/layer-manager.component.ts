import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { LayerIdentifier } from '../../../layer/model/layer-identifier';

type LayerManagerEntry = { layerIdentifier: LayerIdentifier, zIndex: number };

@Component({
  selector: 'app-layer-manager',
  templateUrl: './layer-manager.component.html',
  styleUrls: ['./layer-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayerManagerComponent {
  public layerManagerEntries: LayerManagerEntry[];

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  setLayerVisibility(event: any, layerIdentifier: LayerIdentifier): void {
    if (event.target.checked) {
    //  show layer
    } else {
    //  hide layer
    }
  }

  // Order by ascending property value
  zIndexDescOrder = (a: LayerManagerEntry, b: LayerManagerEntry): number => b.zIndex - a.zIndex;
}
