import {Injectable} from '@angular/core';
import {BaseMapService} from '../../base-map/base-map.service';
import VectorImageLayer from 'ol/layer/VectorImage';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import {HttpClient} from '@angular/common/http';
import GeoJSON from 'ol/format/GeoJSON';
import MultiPolygon from 'ol/geom/MultiPolygon';
import LineString from 'ol/geom/LineString';
import {Coordinate} from 'ol/coordinate';
import {Polygon} from 'ol/geom';
import * as ol_sphere from 'ol/sphere';
import Feature from 'ol/Feature';
import {ObjectWindowService} from '../../object-window/object-window.service';
import {findAttributeOnElementWithAttrs} from '@angular/cdk/schematics';

export enum FeatureTypeEnum {
  FILIALE = 'Filiale',
  ZENSUSGEBIET = 'Zensusgebiet'
}

export type FilialeProperties = {
  id: number,
  type: FeatureTypeEnum,
  parkplaetze: number,
  verkaufsflaeche: number,
  attractiveness: number,
  coordinates: Coordinate
  marketShare?: number,
  marketSharePercentage?: number,
  distanceToZensus?: number,
};

export type ZensusProperties = {
  id: number,
  type: FeatureTypeEnum,
  einwohner: number,
  coordinates: Coordinate,
  probability?: number,
  kaufkraft?: number,
  spendituteGroc?: number,
  marketShareLocale?: number
  marketShareLocalePercentage?: number,
  indicator?: number
};

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  get zensusMap(): ZensusProperties[] {
    return this._zensusMap;
  }
  get storeMap(): FilialeProperties[] {
    return this._storeMap;
  }

  private _storeMap: FilialeProperties[] = [];
  private _zensusMap: ZensusProperties[] = [];

  // durschnittliche Kaufkraft pro Einwohner Berlin in € pro monat = 21687 € / 12 (average Kaufkraft)
  private AK = 1807.25;

  // durschnittlicher Faktor Einwohner/m^2 (average Einwohner Gebietegröße Faktor)
  private AEGF = 0.0045;

  // durschnittliche Ausgaben für Lebensmittel in € pro Monat (average spenditute groceries)
  private ASG = 356;

  private ATT_ENHANCE_FACTOR = this.calculateAttractivenessEnhancementFactor();
  private DIST_DECAY = this.calculateDistanceDecayFactor();

  protected readonly geoJSONFormat = new GeoJSON({
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });

  constructor(private readonly baseMapService: BaseMapService,
              private readonly http: HttpClient,
              private readonly objectWindowService: ObjectWindowService) {
    objectWindowService.currentlySelectedFeature.subscribe((feature: FilialeProperties) => {
      if (feature) {
        if (feature.type === FeatureTypeEnum.FILIALE) {
          this.storeMap.map(store => {
            if (store.id === feature.id) {
              feature.attractiveness = this.calculateAttractivenessForFiliale(feature.parkplaetze, feature.verkaufsflaeche);
              store = feature;
            }
            return store;
          });
        }
      }
    });
  }

  drawFilialen(): void {
    const filialeLayer = this.baseMapService.getLayer('filialen_layer') as VectorImageLayer;
    this.http.get('../assets/map.json').subscribe(value => {
      const readFeatures = this.geoJSONFormat.readFeatures(value);
      readFeatures.forEach(feature => {
        feature.setId(feature.get('id'));
        feature.set('type', FeatureTypeEnum.FILIALE);
        this._storeMap.push(
          {
            id: feature.get('id'),
            type: FeatureTypeEnum.FILIALE,
            attractiveness: this.calculateAttractivenessForFiliale(feature.get('parkplaetze'), feature.get('verkaufsflaeche')),
            parkplaetze: feature.get('parkplaetze'),
            verkaufsflaeche: feature.get('verkaufsflaeche'),
            coordinates: (feature.getGeometry() as Point).getCoordinates()
          } as FilialeProperties,
        );
      });
      (filialeLayer.getSource() as VectorSource).addFeatures(readFeatures);
    });
  }

  addFiliale(feature: Feature): void {
    const id = this.getNextID();
    feature.setId(id);
    feature.set('type', FeatureTypeEnum.FILIALE);
    const filialeLayerSource = (this.baseMapService.getLayer('filialen_layer') as VectorImageLayer).getSource() as VectorSource;
    filialeLayerSource.addFeature(feature);
    const newFilialeProperties: FilialeProperties = {
      id,
      type: FeatureTypeEnum.FILIALE,
      parkplaetze: 0,
      verkaufsflaeche: 0,
      attractiveness: 0,
      coordinates: (feature.getGeometry() as Point).getCoordinates()
    };
    this.objectWindowService.changeCurrentlySelectedFeature(newFilialeProperties);
    this._storeMap.push(newFilialeProperties);
  }

  drawZensusGebiete(): void {
    const zensusLayer = this.baseMapService.getLayer('zensusgebieteLayer') as VectorImageLayer;
    this.http.get('../assets/Verkehrsbezirke.json').subscribe(value => {
      const source = zensusLayer.getSource() as VectorSource;
      const features = this.geoJSONFormat.readFeatures(value);
      features.forEach(feature => {
        feature.setId(feature.get('FID'));
        feature.set('type', FeatureTypeEnum.ZENSUSGEBIET);
        const einwohner = Math.round(ol_sphere.getArea(feature.getGeometry() as Polygon) * this.AEGF);
        this._zensusMap.push({
          id: feature.get('FID'),
          type: FeatureTypeEnum.ZENSUSGEBIET,
          einwohner,
          coordinates: (feature.getGeometry() as MultiPolygon).getInteriorPoints().getFirstCoordinate(),
          kaufkraft: einwohner * this.AK,
          spendituteGroc: einwohner * this.ASG,
        });
      });
      source.addFeatures(features);
    });
  }

  calculateHuffModel(filialId: number): void {
    const filiale = this._storeMap.find(store => store.id === filialId);
    let maxProbability = 0;

    this._zensusMap.forEach(gebiet => {
      let netzProbability = 0;
      let filialProbability: number;
      filialProbability = Math.pow(filiale.attractiveness, this.ATT_ENHANCE_FACTOR) / Math.pow(this.calculateDistancesForFiliale(filiale.coordinates, gebiet.coordinates), this.DIST_DECAY);
      this._storeMap.forEach(store => {
        netzProbability += Math.pow(store.attractiveness, this.ATT_ENHANCE_FACTOR) / Math.pow(this.calculateDistancesForFiliale(store.coordinates, gebiet.coordinates), this.DIST_DECAY);
      });
      gebiet.probability = filialProbability / netzProbability;
      maxProbability = Math.max((gebiet.probability * 100), maxProbability);
      gebiet.marketShareLocale = gebiet.spendituteGroc * gebiet.probability;
      gebiet.marketShareLocalePercentage = gebiet.marketShareLocale / gebiet.spendituteGroc;
      this.colorGebiet(gebiet, maxProbability);
    });
    this.calculateMarketShare(filiale);
  }

  private colorGebiet(gebiet: ZensusProperties, maxProbability: number): void {
    const feature = ((this.baseMapService.getLayer('zensusgebieteLayer') as VectorImageLayer)
      .getSource() as VectorSource)
      .getFeatures().find(zgebiet => zgebiet.get('FID') === gebiet.id);
    const wahrscheinlichkeitInProzent = gebiet.probability * 100;

    // const firstDecil = this.calculateGravitationalDecil(maxProbability, 1);
    // const secondDecil = this.calculateGravitationalDecil(maxProbability, 2);
    // const thirdDecil = this.calculateGravitationalDecil(maxProbability, 3);
    // const fourthDecil = this.calculateGravitationalDecil(maxProbability, 4);
    // const fifthDecil = this.calculateGravitationalDecil(maxProbability, 5);
    // const sixthDecil = this.calculateGravitationalDecil(maxProbability, 6);
    // const seventhDecil = this.calculateGravitationalDecil(maxProbability, 7);
    // const eightsDecil = this.calculateGravitationalDecil(maxProbability, 8);
    // const ninthDecil = this.calculateGravitationalDecil(maxProbability, 9);

    if (wahrscheinlichkeitInProzent > 80) {
      gebiet.indicator = 1;
      feature.set('indicator', 1);
    }
    else if (wahrscheinlichkeitInProzent < 80 && wahrscheinlichkeitInProzent > 70) {
      gebiet.indicator = 2;
      feature.set('indicator', 2);
    }
    else if (wahrscheinlichkeitInProzent < 70 && wahrscheinlichkeitInProzent > 60) {
      gebiet.indicator = 3;
      feature.set('indicator', 3);
    }
    else if (wahrscheinlichkeitInProzent < 60 && wahrscheinlichkeitInProzent > 50) {
      gebiet.indicator = 4;
      feature.set('indicator', 4);
    }
    else if (wahrscheinlichkeitInProzent < 50 && wahrscheinlichkeitInProzent > 40) {
      gebiet.indicator = 5;
      feature.set('indicator', 5);
    }
    else if (wahrscheinlichkeitInProzent < 40 && wahrscheinlichkeitInProzent > 30) {
      gebiet.indicator = 6;
      feature.set('indicator', 6);
    }
    else if (wahrscheinlichkeitInProzent < 30 && wahrscheinlichkeitInProzent > 20) {
      gebiet.indicator = 7;
      feature.set('indicator', 7);
    }
    else if (wahrscheinlichkeitInProzent < 20 && wahrscheinlichkeitInProzent > 10) {
      gebiet.indicator = 8;
      feature.set('indicator', 8);
    }
    // else if (wahrscheinlichkeitInProzent < 50 && wahrscheinlichkeitInProzent > 40) {
    //   gebiet.indicator = 9;
    //   feature.set('indicator', 9);
    // }
    else {
      gebiet.indicator = 10;
      feature.set('indicator', 10);
    }
  }

  private sortZensusMap(a: ZensusProperties, b: ZensusProperties): number {
    if (a.probability < b.probability) {
      return -1;
    }
    if (a.probability > b.probability) {
      return 1;
    }
    return 0;
  }

  private calculateMarketShare(filiale: FilialeProperties): void {
    let marketShare = 0;
    let totalMarketExpenditure = 0;
    this._zensusMap.forEach((gebiet: ZensusProperties) => {
      marketShare += gebiet.marketShareLocale;
      totalMarketExpenditure += gebiet.spendituteGroc;
    });
    filiale.marketShare = marketShare;
    filiale.marketSharePercentage = marketShare / totalMarketExpenditure;
  }

  private calculateAttractivenessForFiliale(parkplaetze: number, verkaufsflaeche: number): number {
    // calculate attractiveness based on parkplaetze & verkaufsflaeche
    // Je mehr parkplaetze und Verkaufsflaeche desto attraktiver
    return parkplaetze + verkaufsflaeche;
  }

  private calculateDistancesForFiliale(filialeCoords: Coordinate, zensusCoords: Coordinate): number {
    return ol_sphere.getLength(new LineString([filialeCoords, zensusCoords]), {projection: 'EPSG:3857'});
  }

  private calculateAttractivenessEnhancementFactor(): number {
    // Je attraktiver eine Filiale ist desto wahrscheinlicher ist der Besuch
    return 1.5;
  }

  private calculateDistanceDecayFactor(): number {
    // Je weiter die Filiale von einem Kunden entfernt ist, desto unwahrscheinlicher ist der Besuch
    return 1.5;
  }

  /**
   * calculate the gravitational decay (10% of maximal probability for each gravitational layer) to color gebiete
   * @param total
   * @param decil
   * @private
   */
  private calculateGravitationalDecil(total: number, decil: number): number {
    return total + decil * (total * 0.1);
  }

  private getNextID(): number {
    return this._storeMap.length + 1;
  }
}
