import {Injectable} from '@angular/core';
import {Layer} from 'ol/layer';
import Select, {SelectEvent} from 'ol/interaction/Select';
import Feature from 'ol/Feature';
import {StyleLike} from 'ol/style/Style';
import {Collection} from 'ol';
import {Geometry} from 'ol/geom';
import {ObjectWindowService, ObjectWindowState} from '../object-window/object-window.service';
import {EzbService, FeatureProperties, FeatureTypeEnum} from "../layer/einzugsgebiete/ezb.service";

@Injectable()
export class SelectFeatureService{

  private _layerInteractionSelect: Select;
  get layerInteractionSelect(): Select {
    return this._layerInteractionSelect;
  }

  constructor(private readonly objectWindowService: ObjectWindowService,
              private ezbService: EzbService) {
  }

  public createLayerInteractionSelect(layers: Layer[], style: StyleLike): void {
    this._layerInteractionSelect = new Select({
      layers,
      style
    });

    this.createLayerInteractionSelectEvents(this._layerInteractionSelect);
  }

  private createLayerInteractionSelectEvents(layerInteractionSelect: Select): void {
    layerInteractionSelect.on(
      'select',
      (e: SelectEvent) => {
        if (!this.isBackgroundClick(e)) {
          this.selectFeature(e);
        }
      }
    );
  }

  private isBackgroundClick(e: SelectEvent): boolean {
    return e.selected.length === 0 && !!e.deselected.length;
  }

  private selectFeature(e: SelectEvent): void {
    if (e.deselected.length > 0) {
      this.objectWindowService.currentlySelectedFeature = null;
      e.deselected[0].set('selected', false);
    }
    const type = e.selected[0].get('type');
    e.selected[0].set('selected', true);
    this.objectWindowService.currentlySelectedFeature = type === FeatureTypeEnum.ZENSUSGEBIET ?
      this.ezbService.zensusMap.find(gebiet => gebiet.properties.id === e.selected[0].getId()) :
      this.ezbService.storeMap.find(store => store.properties.id === e.selected[0].getId());

    this.objectWindowService.isObjectWindowVisible = true;
    this.objectWindowService.objectWindowCurrentState = ObjectWindowState.OPEN;

    // clear prop selected from deselected features
    this.removeSelectedPropFromDeselectedFeatures(e.deselected);
  }

  private removeSelectedPropFromDeselectedFeatures(features: Feature[] | Collection<Feature<Geometry>>): void {
    features.forEach(item => item.setProperties({selected: null}));
  }
}
