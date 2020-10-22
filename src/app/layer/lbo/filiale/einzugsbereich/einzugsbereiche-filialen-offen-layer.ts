import FeatureLayer from '../../../shared/feature-layer';
import EinzugsbereicheFeatureStyle from './einzugsbereiche-feature-style';
import { HttpClient } from '@angular/common/http';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileRenderType from 'ol/layer/VectorTileRenderType';
import { LayerIdentifier } from '../../../model/layer-identifier';
import { environment } from '../../../../../../environments/environment';
import { layersConfig } from '../../../../../config/layer-config';
import { LayerManagerFacade } from '../../../../../store/layer-manager/layer-manager.facade';

/**
 * Layer implementation for Filiale Offen Einzugsbereiche based on OL VectorTileLayer
 */
export default class EinzugsbereicheFilialenOffenLayer extends FeatureLayer {

  private readonly ezbFeatureLayerStyle: EinzugsbereicheFeatureStyle = new EinzugsbereicheFeatureStyle(layersConfig[LayerIdentifier.EINZUGSBEREICHE_FILIALEN_OFFEN].fill_color);

  constructor(http: HttpClient, private layerManagerFacade: LayerManagerFacade) {
    super(http);
    this.createLayer();
    this.layerManagerFacade.getLayerConfig$(LayerIdentifier.EINZUGSBEREICHE_FILIALEN_OFFEN).subscribe((config) => {
      this._layer.setVisible(config.visible);
      this._layer.setZIndex(config.zIndex)
    })
  }

  private createLayer(): void {
    const layer = new VectorTileLayer({
      visible: false,
        renderMode: VectorTileRenderType.IMAGE, // this boosts performance for rendering
    });

    const source = this.createVectorTileSource(environment.layer_features_endpoint_base + LayerIdentifier.EINZUGSBEREICHE_FILIALEN_OFFEN,
                                               {maxZoom: 13}); // do not load smaller tiles to prevent many requests, assuming there is no more detail
    layer.setSource(source);

    layer.setMinZoom(layersConfig[LayerIdentifier.EINZUGSBEREICHE_FILIALEN_OFFEN].minZoom); // approx. resolution < 50
    layer.setStyle(this.ezbFeatureLayerStyle.getStyleFunction());
    layer.set(FeatureLayer.LAYER_NAME_PROPERTY, LayerIdentifier.EINZUGSBEREICHE_FILIALEN_OFFEN);
    this._layer = layer;
  }
}
