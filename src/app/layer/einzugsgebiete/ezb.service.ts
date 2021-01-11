import { Injectable } from '@angular/core';
import {BaseMapService} from '../../base-map/base-map.service';
import VectorLayer from 'ol/layer/Vector';
import VectorImageLayer from 'ol/layer/VectorImage';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Circle from 'ol/geom/Circle';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import {HttpClient} from '@angular/common/http';
import GeoJSON from 'ol/format/GeoJSON';
import {getDistance} from 'ol/sphere';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import LineString from 'ol/geom/LineString';
import {Coordinate} from 'ol/coordinate';

export type FilialeInfo = {
  id: number,
  attractiveness: number,
  distanceToZensus: number,
  coordinates: Coordinate
};

export type FilialeProperties = {
  id: number,
  parkplaetze: number,
  verkaufsflaeche: number,
  coordinates: Coordinate
};

export type ZensusProperties = {
  id: number,
  einwohner: number,
  distanceToFiliale: number,
  coordinates: Coordinate,
  kaufkraft?: number
};

@Injectable({
  providedIn: 'root'
})
export class EzbService {

  private static ATT_ENHANCE_FACTOR = 0;
  private static DIST_DECAY = 1.5;

  private storeMap: Map<number, FilialeInfo> = new Map<number, FilialeInfo>();
  private zensusMap: Map<number, ZensusProperties> = new Map<number, ZensusProperties>();

  protected readonly geoJSONFormat = new GeoJSON({
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });

  constructor(private readonly baseMapService: BaseMapService,
              private readonly http: HttpClient) {
  }

  // addFiliale(): void {
  //
  // }

  drawFilialen(): void {
    const filialeLayer = this.baseMapService.getLayer('filialen_layer') as VectorImageLayer;
    this.http.get('../assets/map.json').subscribe(value => {
      const readFeatures = this.geoJSONFormat.readFeatures(value);
      readFeatures.forEach(feature => feature.setId(feature.get('id')));
      (filialeLayer.getSource() as VectorSource).addFeatures(readFeatures);
    });
  }

  drawZensusGebiete(): void {
    const zensusLayer = this.baseMapService.getLayer('zensusgebieteLayer') as VectorImageLayer;
    this.http.get('../assets/Verkehrsbezirke.json').subscribe(value => {
      (zensusLayer.getSource() as VectorSource).addFeatures(this.geoJSONFormat.readFeatures(value));
    });
  }

  drawEZB(): void {
    const ezbLayer = this.baseMapService.getLayer('einzugsbereich') as VectorLayer;
    const ezbStyle = new Style({
      stroke: new Stroke({
        color: 'black',
        lineDash: [0.1, 7],
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(253, 229, 147, 0.3)',
      })
    });
    const featArr = [
      [1499465.1838703027, 6884453.826560967],
      [1500955.7059218632, 6888466.770545938],
      [1500420.6467238672, 6897218.810284598],
      [1502293.353916854, 6903104.461462557],
      [1502293.353916854, 6881778.530570985],
      [1505618.364647259, 6896645.532572453],
      [1502943.068657278, 6893282.3033279115],
      [1504815.7758502648, 6886938.029980234],
      [1509937.0567453718, 6889651.544484363],
      [1481731.7933081416, 6893052.992243053],
      [1489795.899792228, 6893473.395898619],
      [1497707.1322197434, 6894046.673610756],
      [1493847.062291342, 6895078.573492609],
      [1484827.4929536914, 6896378.002973455],
      [1488420.0332830946, 6898518.2397654345],
      [1488267.1592265244, 6902913.368891838],
      [1493503.0956640588, 6899015.080449302],
      [1498203.972903597, 6900046.980331143],
      [1490063.4293912258, 6880670.1936608525],
      [1491057.1107589332, 6886899.811466093],
      [1495949.0805691842, 6880517.319604281],
      [1495070.0547439049, 6885256.415357961],
      [1483336.9709021302, 6885027.104273109],
      [1488228.9407123816, 6888504.989060076]
    ];

    featArr.forEach( coords => {
      const feature = new Feature();
      feature.setGeometry(new Circle(coords, 5000));
      feature.setStyle(ezbStyle);
      ezbLayer.getSource().addFeature(feature);
    });
  }

  instantiateMaps(): void {
    ((this.baseMapService.getLayer('filialen_layer') as VectorImageLayer).getSource() as VectorSource).getFeatures().forEach(feature => {
      this.storeMap.set(
          feature.get('id'),
          {
            id: feature.get('id'),
            attractiveness: this.calculateAttractivenessForFiliale(feature.getProperties() as FilialeProperties),
            distanceToZensus: 0,
            coordinates: (feature.getGeometry() as Point).getCoordinates()
          });
    });
    ((this.baseMapService.getLayer('zensusgebieteLayer') as VectorImageLayer).getSource() as VectorSource).getFeatures().forEach(feature => {
      this.zensusMap.set(
          feature.get('FID'),
          {
            id: feature.get('FID'),
            einwohner: Math.random() * 1000,
            distanceToFiliale: 0,
            coordinates: (feature.getGeometry() as MultiPolygon).getInteriorPoints().getCoordinates()[0].slice(0, 2)
          }
      );
    });
  }

  calculateHuffModel(filialId: number): void {
    this.instantiateMaps();
    const filiale = this.storeMap.get(filialId);
    let netzProbability = 0;
    let filialProbability;
    this.zensusMap.forEach(gebiet => {
      filialProbability = filiale.attractiveness / this.calculateDistancesForFiliale(filiale.coordinates, gebiet.coordinates);
      this.storeMap.forEach(store => {
        // exclude selected store from filialNetz?
        netzProbability += store.attractiveness / this.calculateDistancesForFiliale(store.coordinates, gebiet.coordinates);
      });
      this.drawMap( gebiet.id, filialProbability / netzProbability);
    });
  }

  setDistancesForFiliale(filialId: number): void {
    const zensusLayer = this.baseMapService.getLayer('zensusgebieteLayer') as VectorImageLayer;
    const source = zensusLayer.getSource() as VectorSource;
    const filiale = ((this.baseMapService.getLayer('filialen_layer') as VectorImageLayer)
        .getSource() as VectorSource)
        .getFeatureById(filialId);

    source.getFeatures().forEach(feature => {
      const gebiet = this.zensusMap.get(feature.get('FID'));
      gebiet.distanceToFiliale = this.calculateDistancesForFiliale((filiale.getGeometry() as Point).getCoordinates(), gebiet.coordinates);
    });
  }

  drawGravitationModel(filialId: number): void {
    const zensusLayer = this.baseMapService.getLayer('zensusgebieteLayer') as VectorImageLayer;
    const filiale = ((this.baseMapService.getLayer('filialen_layer') as VectorImageLayer).getSource() as VectorSource).getFeatureById(filialId);
    const source = zensusLayer.getSource() as VectorSource;
    source.getFeatures().forEach(feature => {
      this.colorGebiet(filiale, feature);
    });
  }

  private calculateAttractivenessForFiliale(filialeProperties: FilialeProperties): number {
    // calculate attratciveness based on parkplaetze & verkaufsflaeche
    return 1;
  }

  private calculateDistancesForFiliale(filialeCoords: Coordinate, zensusCoords: Coordinate): number {
    return Math.round(new LineString([filialeCoords, zensusCoords]).getLength());
  }

  private getDistanceForFiliale(filiale: Feature, gebiet): number {
    const filialCoordinates = (filiale.getGeometry() as Point).getCoordinates();
    const gebietCoordinates = (gebiet.getGeometry() as MultiPolygon).getInteriorPoints().getCoordinates()[0].slice(0, 2);
    // const distance = getDistance(filialCoordinates, gebietCoordinates);
    return Math.round(new LineString([filialCoordinates, gebietCoordinates]).getLength());
  }

  private colorGebiet(filiale: Feature, gebiet: Feature): void {
    const filialCoordinates = (filiale.getGeometry() as Point).getCoordinates();
    const gebietCoordinates = (gebiet.getGeometry() as MultiPolygon).getInteriorPoints().getCoordinates()[0].slice(0, 2);
    // const distance = getDistance(filialCoordinates, gebietCoordinates);
    const distance = Math.round(new LineString([filialCoordinates, gebietCoordinates]).getLength());

    if (distance > 50000) {
      gebiet.set('indicator', 11);
    }
    else if (distance < 50000 && distance > 40000) {
      gebiet.set('indicator', 10);
    }
    else if (distance < 40000 && distance > 30000) {
      gebiet.set('indicator', 9);
    }
    else if (distance < 30000 && distance > 20000) {
      gebiet.set('indicator', 8);
    }
    else if (distance < 20000 && distance > 10000) {
      gebiet.set('indicator', 7);
    }
    else if (distance < 10000 && distance > 5000) {
      gebiet.set('indicator', 6);
    }
    else if (distance < 5000 && distance > 4000) {
      gebiet.set('indicator', 5);
    }
    else if (distance < 4000 && distance > 3000) {
      gebiet.set('indicator', 4);
    }
    else if (distance < 3000 && distance > 2000) {
      gebiet.set('indicator', 3);
    }
    else if (distance < 2000 && distance > 1000) {
      gebiet.set('indicator', 2);
    }
    else if (distance < 1000 && distance > 700) {
      gebiet.set('indicator', 1);
    }
    else {
      gebiet.set('indicator', 0);
    }
  }

  private drawMap(gebietId: number, probability: number): void {
    const zensusLayerSource = (this.baseMapService.getLayer('zensusgebieteLayer') as VectorImageLayer).getSource() as VectorSource;
    console.log('probability: ', probability * 100000);
    // zensusLayerSource.getFeatureById(gebietId).set('huff', probability);
  }
}
