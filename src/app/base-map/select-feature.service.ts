import {Injectable} from '@angular/core';
import {Layer} from 'ol/layer';
import Select, {SelectEvent} from 'ol/interaction/Select';
import Feature from 'ol/Feature';
import {StyleLike} from 'ol/style/Style';
import {Collection} from 'ol';
import {Geometry} from 'ol/geom';
import {ObjectWindowService, ObjectWindowState} from '../object-window/object-window.service';
import {FeatureService, FeatureTypeEnum, FilialeProperties, ZensusProperties} from '../layer/einzugsgebiete/feature.service';

@Injectable()
export class SelectFeatureService{

  currentlySelectedFeature: FilialeProperties | ZensusProperties;

  private _layerInteractionSelect: Select;
  get layerInteractionSelect(): Select {
    return this._layerInteractionSelect;
  }

  constructor(private readonly objectWindowService: ObjectWindowService,
              private ezbService: FeatureService) {
    this.objectWindowService.currentlySelectedFeature$.subscribe(props => this.currentlySelectedFeature = props);
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
      this.objectWindowService.changeCurrentlySelectedFeature(null);
      e.deselected[0].set('selected', false);
    }
    const type = e.selected[0].get('type');
    e.selected[0].set('selected', true);

    const selectedFeature = type === FeatureTypeEnum.ZENSUSGEBIET ?
        this.ezbService.zensusMap.find(gebiet => gebiet.id === e.selected[0].getId()) :
        this.ezbService.storeMap.find(store => store.id === e.selected[0].getId());

    this.objectWindowService.changeCurrentlySelectedFeature(selectedFeature);

    this.objectWindowService.isObjectWindowVisible = true;
    this.objectWindowService.objectWindowCurrentState = ObjectWindowState.OPEN;

    // clear prop selected from deselected features
    this.removeSelectedPropFromDeselectedFeatures(e.deselected);
  }

  private removeSelectedPropFromDeselectedFeatures(features: Feature[] | Collection<Feature<Geometry>>): void {
    features.forEach(item => item.setProperties({selected: null}));
  }
}
