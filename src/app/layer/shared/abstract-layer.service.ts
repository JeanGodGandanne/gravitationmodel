import { LayerIdentifier } from '../model/layer-identifier';
import { Layer } from 'ol/layer';
import FeatureLayer from './feature-layer';
import { LayerSource } from '../model/layer-source.enum';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OlObjectFactories } from '../../open-layers/factories/ol-object-factories';
import {LayerConfigType} from '../../config/layer-config.type';

/**
 * Use this Superservice to create a specific Layerservice related to a concrete LayerIdentifier
 * and its configuration. Layer specialities needs to be implemented in the extended service.
 */
export abstract class AbstractLayerService<T extends LayerIdentifier> implements OnDestroy {

  private readonly GEOJSON_FORMAT;

  private readonly subscriptions: Subscription[] = [];

  private _layer: Layer;

  public get layer(): Layer {
    return this._layer;
  }

  protected constructor(public readonly layerIdentifier: T,
                        protected olObjectFactories: OlObjectFactories) {
    this.GEOJSON_FORMAT = olObjectFactories.newGeoJSON({
      featureProjection: 'EPSG:3857' // target projection of our map
    });
    // 1. wann werden die LayerServices instanziiert? Annahme: erst wenn der zugehörige Layer benötigt wird (zB. in BaseMapComponent)
    // 2. wann werden die Subscriptions wieder gelöscht? Annahme: nie
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Decides which layer type needs to be created due to layer configuration.
   * Insert other layer type creations here.
   */
  private createLayer(): Layer {
    const layerConfiguration: LayerConfigType = this.getLayerConfiguration();
    switch (layerConfiguration.sourceType) {
      case LayerSource.VECTOR_SOURCE:
        return this.createVectorLayerWithConfiguration(layerConfiguration);
      default:
    }
  }

  /**
   * Creates a VectorLayer with VectorSource and mandatory attributes.
   * Insert more mandatory attributes or further layer specialities here.
   * @param config LayerConfig for concrete LayerIdentifier
   */
  private createVectorLayerWithConfiguration(config: LayerConfigType): Layer {
    const layer = this.olObjectFactories.newVectorLayer( {
      zIndex: config.zIndex,
      visible: config.visible
    });
    layer.setSource(this.olObjectFactories.newVectorSource({
      format: this.GEOJSON_FORMAT
    }));
    layer.set(FeatureLayer.LAYER_NAME_PROPERTY, this.layerIdentifier);
    return layer;
  }

  private *updateLayerSettings(layer: Layer, lastLayerConfig: LayerConfigType, newLayerConfig: LayerConfigType): IterableIterator<void> {
    yield this.setLayerVisibility(layer, lastLayerConfig.visible, newLayerConfig.visible);
    yield this.setLayerZIndex(layer, lastLayerConfig.zIndex, newLayerConfig.zIndex);
  }

  private setLayerVisibility(layer: Layer, lastVisible: boolean, newVisible: boolean): void {
    if (lastVisible !== newVisible) { layer.setVisible(newVisible); }
  }

  private setLayerZIndex(layer: Layer, lastZIndex: number, newZIndex: number): void {
    if (lastZIndex !== newZIndex) { layer.setZIndex(newZIndex); }
  }

  /**
   * Provides the configuration for a specific layer type.
   * Use 'layersConfig' with the needed LayerIdentifier.
   * This method needs to be overridden by all subservices.
   */
  abstract getLayerConfiguration(): LayerConfigType;
}
