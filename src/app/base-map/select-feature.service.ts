import {Injectable} from '@angular/core';
import {Layer} from 'ol/layer';
import Select, {SelectEvent} from 'ol/interaction/Select';
import Feature from 'ol/Feature';
import {StyleLike} from 'ol/style/Style';
import {Collection} from 'ol';
import {Geometry} from 'ol/geom';
import {ObjectWindowService, ObjectWindowState} from '../object-window/object-window.service';

@Injectable()
export class SelectFeatureService{

  private _layerInteractionSelect: Select;
  get layerInteractionSelect(): Select {
    return this._layerInteractionSelect;
  }

  constructor(private readonly objectWindowService: ObjectWindowService) {
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
        if (this.isBackgroundClick(e)) { // background click
          this.reselectFeature(e);
        } else{ // is allowed to select feature
          this.selectFeature(e);
        }
      }
    );
  }

  private isBackgroundClick(e: SelectEvent): boolean {
    return e.selected.length === 0 && !!e.deselected.length;
  }

  private reselectFeature(e: SelectEvent): void {
    e.deselected.forEach(feature =>
      this._layerInteractionSelect.getFeatures().push(feature)
    );
  }

  private deselectFeaturesOnMap(): void {
    // remove select prop from all features and clear layerInteractionSelect
    this.removeSelectedPropFromDeselectedFeatures(this._layerInteractionSelect.getFeatures());
    this.clearAllLayers();
  }

  private selectFeature(e: SelectEvent): void {
    console.log(e);

    this.objectWindowService.isObjectWindowVisible = !this.objectWindowService.isObjectWindowVisible;
    this.objectWindowService.objectWindowCurrentState === ObjectWindowState.OPEN ?
        this.objectWindowService.objectWindowCurrentState = ObjectWindowState.CLOSED :
        this.objectWindowService.objectWindowCurrentState = ObjectWindowState.OPEN;

    // clear prop selected from deselected features
    this.removeSelectedPropFromDeselectedFeatures(e.deselected);
  }

  private removeSelectedPropFromDeselectedFeatures(features: Feature[] | Collection<Feature<Geometry>>): void {
    features.forEach(item => item.setProperties({selected: null}));
  }

  private clearAllLayers(): void {
    this._layerInteractionSelect.getFeatures().clear();
  }
}
