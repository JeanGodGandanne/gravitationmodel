import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { LayerIdentifier } from '../../../layer/model/layer-identifier';
import {BaseMapService} from '../../../base-map/base-map.service';

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
    private changeDetectorRef: ChangeDetectorRef,
    private baseMapService: BaseMapService
  ) {
    this.layerManagerEntries = baseMapService.getLayers().getArray().map(layer => {
      return {layerIdentifier: layer.get('name'),
              zIndex: layer.getZIndex()} as LayerManagerEntry;
    });
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
