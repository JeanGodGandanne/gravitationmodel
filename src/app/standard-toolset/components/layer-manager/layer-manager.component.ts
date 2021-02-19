import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { LayerIdentifier } from '../../../layer/model/layer-identifier';
import {BaseMapService} from '../../../base-map/base-map.service';

type LayerManagerEntry = { layerIdentifier: LayerIdentifier, visibility: boolean };

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
              visibility: layer.getVisible()} as LayerManagerEntry;
    });
  }

  setLayerVisibility(event: any, layerIdentifier: LayerIdentifier): void {
    if (event.checked) {
    //  show layer
      this.baseMapService.getLayers().getArray().find(layer => layer.get('name') === layerIdentifier).setVisible(true);
    } else {
    //  hide layer
      this.baseMapService.getLayers().getArray().find(layer => layer.get('name') === layerIdentifier).setVisible(false);
    }
  }
}
