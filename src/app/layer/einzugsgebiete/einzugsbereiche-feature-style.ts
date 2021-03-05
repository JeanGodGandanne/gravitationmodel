import Style from 'ol/style/Style';
import {FeatureLike} from 'ol/Feature';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export interface ColorInterface {
  gravitationalRing: number;
  value: string;
}

/**
 * Style generator for Filial-Einzugsgebiete
 * Generates dynamic line and label style for different Einzugsgebiete based on OL Style-function
 * @Variable ezbLabelIconStyleSvg style for the icon displayed on top of the polygon
 * @Variable ezbLineStyle style for the polygon
 */
export default class EinzugsbereicheFeatureStyle {

  private ezbLineStyle = new Style();

  protected readonly colorGradient: ColorInterface[] = [
    { gravitationalRing: 1, value: 'rgb(255, 0, 0)'},
    { gravitationalRing: 2, value: 'rgb(255, 70, 0)'},
    { gravitationalRing: 3, value: 'rgb(255, 105, 0)'},
    { gravitationalRing: 4, value: 'rgb(255, 134, 0)'},
    { gravitationalRing: 5, value: 'rgb(255, 160, 0)'},
    { gravitationalRing: 6, value: 'rgb(246, 185, 0)'},
    { gravitationalRing: 7, value: 'rgb(241, 206, 31)'},
    { gravitationalRing: 8, value: 'rgb(236, 227, 66)'},
    { gravitationalRing: 9, value: 'rgb(231, 247, 98)'}
  ];

  constructor(private fillColor: string) {

    this.ezbLineStyle.setStroke(new Stroke({
      color: 'white',
      width: 2,
      lineDash: [0.1, 7]
    }));
    this.ezbLineStyle.setFill(new Fill({
      color: this.fillColor
    }));
  }

  /**
   * Returns OL style function for specific styles of Einzugsbereiche depending on feature and resolution
   */
  getStyleFunction(): (feature: FeatureLike) => Style {
    return (feature: FeatureLike): Style => {
      const indicator = feature.get('indicator');
      if (!indicator) {
        return this.ezbLineStyle;
      }
      const color = this.colorGradient.find(colorGradient => colorGradient.gravitationalRing === indicator).value;
      this.ezbLineStyle.getFill().setColor(color);
      return this.ezbLineStyle;
    };
  }
}
