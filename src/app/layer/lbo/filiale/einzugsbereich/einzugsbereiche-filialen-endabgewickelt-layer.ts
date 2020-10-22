import FeatureLayer from '../../../shared/feature-layer';
import { HttpClient } from '@angular/common/http';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileRenderType from 'ol/layer/VectorTileRenderType';
import { environment } from '../../../../../../environments/environment';
import EinzugsbereicheFeatureStyle from './einzugsbereiche-feature-style';
import { LayerIdentifier } from '../../../model/layer-identifier';
import { layersConfig } from '../../../../../config/layer-config';
import { LayerManagerFacade } from '../../../../../store/layer-manager/layer-manager.facade';

export default class EinzugsbereicheFilialenEndabgewickeltLayer extends FeatureLayer {

  private readonly ezbFeatureLayerStyle: EinzugsbereicheFeatureStyle = new EinzugsbereicheFeatureStyle(layersConfig[LayerIdentifier.EINZUGSBEREICHE_FILIALEN_ENDABGEWICKELT].fill_color);

  constructor(http: HttpClient, private layerManagerFacade: LayerManagerFacade) {
    super(http);
    this.createLayer()
    this.layerManagerFacade.getLayerConfig$(LayerIdentifier.EINZUGSBEREICHE_FILIALEN_ENDABGEWICKELT).subscribe((config) => {
      this._layer.setVisible(config.visible);
      this._layer.setZIndex(config.zIndex)
    })
  }

  private createLayer(): void {
    const layer = new VectorTileLayer({
      visible: false,
      renderMode: VectorTileRenderType.IMAGE, // this boosts performance for rendering
    });

    const source = this.createVectorTileSource(environment.layer_features_endpoint_base + LayerIdentifier.EINZUGSBEREICHE_FILIALEN_ENDABGEWICKELT,
                                               {maxZoom: 13}); // do not load smaller tiles to prevent many requests, assuming there is no more detail
    layer.setSource(source);

    layer.setMinZoom(layersConfig[LayerIdentifier.EINZUGSBEREICHE_FILIALEN_ENDABGEWICKELT].minZoom); // approx. resolution < 50
    layer.setStyle(this.ezbFeatureLayerStyle.getStyleFunction());
    layer.set(FeatureLayer.LAYER_NAME_PROPERTY, LayerIdentifier.EINZUGSBEREICHE_FILIALEN_ENDABGEWICKELT);
    this._layer = layer;
  }
}
