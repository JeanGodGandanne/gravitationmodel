import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Feature, {FeatureLike} from 'ol/Feature';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export interface ColorInterface {
  gravitationalRing: number,
  value: string
}

/**
 * Style generator for Filial-Einzugsgebiete
 * Generates dynamic line and label style for different Einzugsgebiete based on OL Style-function
 * @Variable ezbLabelIconStyleSvg style for the icon displayed on top of the polygon
 * @Variable ezbLineStyle style for the polygon
 */
export default class EinzugsbereicheFeatureStyle {

  private ezbLabelIconStyleSvg = new Style();
  private ezbLineStyle = new Style();

  private textStyle = new Text({
    text: '',
    textBaseline: 'middle',
    font: 'bold 13px OpenSans-Bold, Open Sans',
    overflow: true,
    offsetY: -32,
    offsetX: 14
  });

  protected readonly colorGradient: ColorInterface[] = [
    { gravitationalRing: 1, value: 'rgb(255,100,100)'},
    { gravitationalRing: 2, value: 'rgb(252,145,145)'},
    { gravitationalRing: 3, value: 'rgb(248,161,123)'},
    { gravitationalRing: 4, value: 'rgb(232,180,112)'},
    { gravitationalRing: 5, value: 'rgb(208,198,117)'},
    { gravitationalRing: 6, value: 'rgb(178,214,138)'},
    { gravitationalRing: 7, value: 'rgb(138,217,157)'},
    { gravitationalRing: 8, value: 'rgb(90,217,183)'},
    { gravitationalRing: 9, value: 'rgb(0,215,212)'},
    { gravitationalRing: 10, value: 'rgb(0,200,236)'},
    { gravitationalRing: 11, value: 'rgb(0,180,255)'},
    { gravitationalRing: 12, value: 'rgb(0,155,255)'},
    { gravitationalRing: 13, value: 'rgb(95,122,251)'}
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
      // if (feature.get('selected') === true) {
      //   this.ezbLineStyle.getStroke().setColor('black');
      // }
      if (!indicator) {
        return this.ezbLineStyle;
      }
      const color = this.colorGradient.find(color => color.gravitationalRing === indicator).value;
      this.ezbLineStyle.getFill().setColor(color);
      return this.ezbLineStyle;
    };
  }
}
