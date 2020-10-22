import { LayerIdentifier } from '../model/layer-identifier';
import VectorSource from 'ol/source/Vector';
import { GebieteWidgetFacade } from '../../../store/gebiete-widget/gebiete-widget.facade';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { Style } from 'ol/style';
import { LayerManagerFacade } from '../../../store/layer-manager/layer-manager.facade';
import { filter, map, mergeAll } from 'rxjs/operators';
import { layersConfig } from '../../../config/layer-config';
import { Injectable } from '@angular/core';
import { AbstractLayerService } from '../shared/abstract-layer.service';
import { LayerConfigType } from '../../../config/layer-config.type';
import { Color } from '../../../model/interface/color.interface';
import { NGXLogger } from 'ngx-logger';
import { FahrzeitenzoneStateExtension } from '../../../store/gebiete-widget/gebiete-widget.reducer';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { addAlpha } from '../../dialog/components/color-picker/color-palettes';
import { OlObjectFactories } from '../../open-layers/factories/ol-object-factories';

/**
 * Arbeitslayer includes all Gebiete (Manuelle Gebiete and Fahrzeitenzonen) coming from the GebieteWidget.
 */
@Injectable({
  providedIn: 'root'
})
export class GebieteWidgetArbeitslayerService extends AbstractLayerService<LayerIdentifier.ARBEITSLAYER> {
  private static readonly FEATURE_VISIBLE_PROPERTY = 'visible';
  private static readonly FEATURE_VERSION_PROPERTY = 'version';
  private static readonly FEATURE_COLOR_PROPERTY = 'color';
  private static readonly FEATURE_CONTOUR_PROPERTY = 'contour';

  private readonly vectorSource: VectorSource;

  constructor(layerManagerFacade: LayerManagerFacade,
              private gebieteWidgetFacade: GebieteWidgetFacade,
              protected olObjectFactories: OlObjectFactories,
              ngxLogger: NGXLogger) {
    super(LayerIdentifier.ARBEITSLAYER, layerManagerFacade, olObjectFactories, ngxLogger);
    this.vectorSource = this.layer.getSource() as VectorSource; // LATER: improve type inference, hide layer from subclasses if possible

    super.addSubscription(this.observeNewGebieteGeometry());
    super.addSubscription(this.observeChangesGebieteGeometry());
    super.addSubscription(this.observeGebieteVisibility());
    super.addSubscription(this.observeGebieteColor());
    super.addSubscription(this.observeGebieteContour());
    super.addSubscription(this.observeDeleteGebiet());
  }

  getLayerConfiguration(): LayerConfigType {
    return layersConfig[LayerIdentifier.ARBEITSLAYER];
  }

  private observeNewGebieteGeometry(): Subscription {
    return this.gebieteWidgetFacade.gebieteWidgetFahrzeitenzonenState$.pipe(
        mergeAll(), // flatten emissions
        filter(fahrzeitenzone => Boolean(fahrzeitenzone.geometry)), // skip fzz without geometries
        filter(fahrzeitenzone => Boolean(this.vectorSource.getFeatureById(fahrzeitenzone.id)) === false) // skip fzz already in layer
    ).subscribe(
        (fahrzeitenzone: FahrzeitenzoneStateExtension) => {
          const feature = this.olObjectFactories.newFeature(cloneDeep(fahrzeitenzone.geometry.getGeometry()));
          feature.setId(fahrzeitenzone.id);
          feature.setStyle(this.getFahrzeitenzoneStyle(fahrzeitenzone.color, fahrzeitenzone.contour));
          feature.set(GebieteWidgetArbeitslayerService.FEATURE_VISIBLE_PROPERTY, true, true);
          feature.set(GebieteWidgetArbeitslayerService.FEATURE_VERSION_PROPERTY, fahrzeitenzone.version, true);
          feature.set(GebieteWidgetArbeitslayerService.FEATURE_COLOR_PROPERTY, fahrzeitenzone.color, true);
          feature.set(GebieteWidgetArbeitslayerService.FEATURE_CONTOUR_PROPERTY, fahrzeitenzone.contour, true);
          this.vectorSource.addFeature(feature);
        }
    );
  }

  private observeChangesGebieteGeometry(): Subscription {
    return this.gebieteWidgetFacade.gebieteWidgetFahrzeitenzonenState$.pipe(
        mergeAll(),
        filter(fahrzeitenzone => Boolean(fahrzeitenzone.geometry)), // skip fzz without geometries
        map<FahrzeitenzoneStateExtension, [FahrzeitenzoneStateExtension, Feature<Geometry>]>(fahrzeitenzone => [fahrzeitenzone, this.vectorSource.getFeatureById(fahrzeitenzone.id)]), // update on existing features only
        filter(([fahrzeitenzone, feature]) => Boolean(feature) && feature.get(GebieteWidgetArbeitslayerService.FEATURE_VERSION_PROPERTY) !== fahrzeitenzone.version), // skip features with noc geometry change
    ).subscribe(
        ([fahrzeitenzone, feature]) => {
          feature.setGeometry(cloneDeep(fahrzeitenzone.geometry.getGeometry()));
          feature.set(GebieteWidgetArbeitslayerService.FEATURE_VERSION_PROPERTY, fahrzeitenzone.version, true);
        }
    );
  }

  private observeGebieteVisibility(): Subscription {
    return this.gebieteWidgetFacade.gebieteWidgetFahrzeitenzonenState$.pipe(
        mergeAll(),
        filter(fahrzeitenzone => Boolean(fahrzeitenzone.geometry)) // skip fzz without geometries
    ).subscribe(
        (fahrzeitenzone: FahrzeitenzoneStateExtension) => {
          const feature = this.vectorSource.getFeatureById(fahrzeitenzone.id);
          if (!feature) {
            return;
          }
          if (fahrzeitenzone.visible && feature.get(GebieteWidgetArbeitslayerService.FEATURE_VISIBLE_PROPERTY) === false) {
            feature.setStyle(this.getFahrzeitenzoneStyle(fahrzeitenzone.color, fahrzeitenzone.contour));
            feature.set(GebieteWidgetArbeitslayerService.FEATURE_VISIBLE_PROPERTY, true, true);
            feature.set(GebieteWidgetArbeitslayerService.FEATURE_COLOR_PROPERTY, fahrzeitenzone.color.value, true);
            feature.set(GebieteWidgetArbeitslayerService.FEATURE_CONTOUR_PROPERTY, fahrzeitenzone.contour, true);
          }
          if (fahrzeitenzone.visible === false && feature.get(GebieteWidgetArbeitslayerService.FEATURE_VISIBLE_PROPERTY)) {
            feature.setStyle(this.olObjectFactories.newStyle(null));
            feature.set(GebieteWidgetArbeitslayerService.FEATURE_VISIBLE_PROPERTY, false, true);
          }
        }
    );
  }

  private observeGebieteColor(): Subscription {
    return this.gebieteWidgetFacade.gebieteWidgetFahrzeitenzonenState$.pipe(
        mergeAll(),
        filter(fahrzeitenzone => Boolean(fahrzeitenzone.geometry))
    ).subscribe(
        (fahrzeitenzone: FahrzeitenzoneStateExtension) => {
          const feature = this.vectorSource.getFeatureById(fahrzeitenzone.id);
          if (!feature) {
            return;
          }
          if (fahrzeitenzone.visible && feature.get(GebieteWidgetArbeitslayerService.FEATURE_VISIBLE_PROPERTY)
              && fahrzeitenzone.color.value !== feature.get(GebieteWidgetArbeitslayerService.FEATURE_COLOR_PROPERTY)) {
            feature.setStyle(this.getFahrzeitenzoneStyle(fahrzeitenzone.color, fahrzeitenzone.contour));
            feature.set(GebieteWidgetArbeitslayerService.FEATURE_COLOR_PROPERTY, fahrzeitenzone.color.value, true);
          }
        }
    );
  }

  private observeGebieteContour(): Subscription {
    return this.gebieteWidgetFacade.gebieteWidgetFahrzeitenzonenState$.pipe(
      mergeAll(),
      filter(fahrzeitenzone => Boolean(fahrzeitenzone.geometry))
    ).subscribe(
      (fahrzeitenzone: FahrzeitenzoneStateExtension) => {
        const feature = this.vectorSource.getFeatureById(fahrzeitenzone.id);
        if (!feature) {
          return;
        }
        if (fahrzeitenzone.visible && feature.get(GebieteWidgetArbeitslayerService.FEATURE_VISIBLE_PROPERTY)
          && fahrzeitenzone.contour !== feature.get(GebieteWidgetArbeitslayerService.FEATURE_CONTOUR_PROPERTY)) {
          feature.setStyle(this.getFahrzeitenzoneStyle(fahrzeitenzone.color, fahrzeitenzone.contour));
          feature.set(GebieteWidgetArbeitslayerService.FEATURE_CONTOUR_PROPERTY, fahrzeitenzone.contour, true);
        }
      }
    );
  }

  private observeDeleteGebiet(): Subscription {
    return this.gebieteWidgetFacade.gebieteWidgetFahrzeitenzonenState$.subscribe(
        (fahrzeitenzonen: FahrzeitenzoneStateExtension[]) =>
            this.vectorSource.getFeatures()
                .filter(feature => !fahrzeitenzonen.find(fahrzeitenzone => feature.getId() === fahrzeitenzone.id))
                .forEach(feature => this.vectorSource.removeFeature(feature))
    );
  }

  private getFahrzeitenzoneStyle(color: Color, contour: boolean): Style {
    return contour ? this.getFahrzeitenzoneStrokeStyle(color) : this.getFahrzeitenzoneFillStyle(color);
  }

  private getFahrzeitenzoneFillStyle(color: Color): Style {
    return this.olObjectFactories.newStyle({
      stroke: this.olObjectFactories.newStroke({
        color: 'white',
        width: 2,
        lineDash: [0.1, 7],
      }),
      fill: this.olObjectFactories.newFill({
        color: addAlpha(color.value, 0.3)
      })
    });
  }

  private getFahrzeitenzoneStrokeStyle(color: Color): Style {
    return this.olObjectFactories.newStyle({
      stroke: this.olObjectFactories.newStroke({
        color: color.value,
        width: 2,
        lineDash: [0.1, 7],
      }),
    });
  }
}
