import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Feature from 'ol/Feature';
import Icon from 'ol/style/Icon';
import { IconFileFormat } from '../../shared/icon-file-format';

export default class WettbewerberFeatureStyle {

  private styleCache = {};

  private zIndex = 0;

  private wettbewerberStyleSvg = new Style();
  private wettbewerberStylePng = new Style();
  private wettbewerberSelectedStyleSvg = new Style();
  private wettbewerberSelectedStylePng = new Style();
  private wettbewerberStylePoints = new Map<PointStyleRadius, Style>(); // stores point styles for specific radius sizes

  private textStyle = new Text({
    text: '',
    textBaseline: 'middle',
    font: 'bold 13px OpenSans-Bold, Open Sans',
    overflow: true,
    offsetY: -30,
  });

  constructor(private backgroundColor: string, private fontColor: string) {
    this.textStyle.setFill(new Fill({
      color: `#${fontColor}`
    }));

    Object.values(PointStyleRadius).forEach((pointRadius: PointStyleRadius) => {
      this.wettbewerberStylePoints.set(pointRadius, new Style({
        image: new Circle({
          radius: pointRadius,
          fill: new Fill({
              color: `#${backgroundColor}`
            }
          ),
          stroke: new Stroke({
            color: 'black',
            width: 0.1
          })
        })
      }));
    });

    this.wettbewerberStyleSvg.setText(this.textStyle);
    this.wettbewerberStyleSvg.setImage(this.createTintedIcon(IconFileFormat.SVG, backgroundColor, false));
    this.wettbewerberStylePng.setImage(this.createTintedIcon(IconFileFormat.PNG, backgroundColor, false));
    this.wettbewerberSelectedStyleSvg.setText(this.textStyle);
    this.wettbewerberSelectedStyleSvg.setImage(this.createTintedIcon(IconFileFormat.SVG, backgroundColor, true));
    this.wettbewerberSelectedStylePng.setImage(this.createTintedIcon(IconFileFormat.PNG, backgroundColor, true));
  }

  /**
   * Returns OL style function for specific styles for Filialen depending on feature and resolution
   */
  getStyleFunction(): (feature: Feature, resolution: number) => Style {

    return (feature: Feature, resolution: number): Style => {
      if (feature.getProperties().selected) {
        if (resolution <= 250) {
          // we do not cache selected icons, as only one can be selected
          const wettbewerberKuerzel = feature.getProperties().wettbewerberKuerzel;
          this.wettbewerberSelectedStyleSvg.getText().setText(wettbewerberKuerzel);
          this.wettbewerberSelectedStyleSvg.setZIndex(this.zIndex++); // necessary for grouping text label and icon together
          return this.wettbewerberSelectedStyleSvg;
        }
        // pin icon as png
        if (resolution <= 500) {
          return this.wettbewerberSelectedStylePng;
        }
      } else {
        // pin icon as svg
        if (resolution <= 250) {
          const wettbewerberKuerzel = feature.getProperties().wettbewerberKuerzel;

          if (!this.styleCache[wettbewerberKuerzel]) {
            const cachedStyle = this.wettbewerberStyleSvg.clone();
            cachedStyle.getText().setText(wettbewerberKuerzel);

            this.styleCache[wettbewerberKuerzel] = cachedStyle;
          }

          const style = this.styleCache[wettbewerberKuerzel];
          style.setZIndex(this.zIndex++); // necessary for grouping text label and icon together
          return style;
        }

        // pin icon as png
        if (resolution <= 500) {
          return this.wettbewerberStylePng;
        }
      }

      // circle icon
      // TODO selected style above 500 resolution will be defined later
      if (resolution <= 1000) {
        return this.wettbewerberStylePoints.get(PointStyleRadius.LARGE);
      }
      if (resolution <= 2000) {
        return this.wettbewerberStylePoints.get(PointStyleRadius.NORMAL);
      }
      if (resolution <= 5000) {
        return this.wettbewerberStylePoints.get(PointStyleRadius.SMALL);
      }
      if (resolution > 5000) {
        return this.wettbewerberStylePoints.get(PointStyleRadius.TINY);
      }
    }
  }

  private createTintedIcon(format: IconFileFormat, color: string, selected: boolean): Icon {
    let src: string;
    if (format === IconFileFormat.SVG) {
      if (selected) {
        src = 'assets/geometries/icons/PIN_selected.svg';
      } else {
        src = 'assets/geometries/icons/PIN.svg';
      }
    }
    if (format === IconFileFormat.PNG) {
      if (selected) {
        src = 'assets/geometries/icons/PIN_selected.png';
      } else {
        src = 'assets/geometries/icons/PIN.png';
      }
    }
    return new Icon({
      anchor: [0.5, 1],
      src,
      color: `#${color}`,
    });
  }
}

enum PointStyleRadius {
  'LARGE' = 12,
  'NORMAL' = 9,
  'SMALL' = 6,
  'TINY' = 5
}
