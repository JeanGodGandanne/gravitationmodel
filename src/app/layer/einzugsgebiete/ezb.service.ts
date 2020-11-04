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

@Injectable({
  providedIn: 'root'
})
export class EzbService {

  constructor(private readonly baseMapService: BaseMapService) { }

  // addFiliale(): void {
  //
  // }

  drawEZB(): void {
    const ezbLayer = this.baseMapService.getLayer('einzugsbereich') as VectorLayer;
    const filialLayerSource = (this.baseMapService.getLayer('filialen_layer') as VectorImageLayer).getSource() as VectorSource;
    const ezbStyle = new Style({
      stroke: new Stroke({
        color: 'rgba(255,0,0,0.4)',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(255,0,0,0.2)',
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
}
