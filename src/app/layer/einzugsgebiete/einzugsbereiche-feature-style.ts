import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Feature from 'ol/Feature';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

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

  protected readonly colorGradient = [
    '#fc9191',
    '#f8a17b',
    '#e8b470',
    '#d0c675',
    '#b2d68a',
    '#8ad99d',
    '#5ad9b7',
    '#00d7d4',
    '#00c8ec',
    '#00b4ff',
    '#009bff',
    '#5f7afb'];

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
  getStyleFunction(): (feature: Feature, resolution: number) => Style[] {
    return (feature: Feature): Style[] => {
      const indicator = feature.get('indicator');
      if (indicator) {
        this.ezbLineStyle.getFill().setColor(this.colorGradient[indicator]);
      }
      return [this.ezbLineStyle];
    };
  }
}
