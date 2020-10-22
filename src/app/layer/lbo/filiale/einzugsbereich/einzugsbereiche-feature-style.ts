import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';

/**
 * Style generator for Filial-Einzugsgebiete
 * Generates dynamic line and label style for different Einzugsgebiete based on OL Style-function
 * @Variable ezbLabelIconStyleSvg style for the icon displayed on top of the polygon
 * @Variable ezbLineStyle style for the polygon
 */
export default class EinzugsbereicheFeatureStyle {
  private iconCache = {};

  private zIndex = 0;

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

  constructor(private fillColor: string) {
    this.ezbLabelIconStyleSvg.setText(this.textStyle);
    this.ezbLabelIconStyleSvg.setGeometry((feature: Feature): Geometry => {
      let geometry;
      const geometryType = feature.getGeometry().getType();

      // interior Points guarantee a point inside the polygon, so the label can not 'float' outside the polygon or inbetween a multipolygon
      if (geometryType === 'Polygon') {
        geometry = feature.getGeometry() as Polygon;
        return geometry.getInteriorPoint();
      } else if (geometryType === 'MultiPolygon') {
        geometry = feature.getGeometry() as MultiPolygon;
        // returns a multipoint so each polygon piece gets it's own label
        return geometry.getInteriorPoints();
      }
    });

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
      const label = feature.getProperties().objektNummer;

      const scaleSVGWidth = this.scaleSVGWidth(label);
      const scaleLabelWidth = this.scaleLabelWidth(label);
      const precision = 10;
      // round the scale svg width to tenths position to reduce cache size
      const roundedScale = Math.ceil(scaleLabelWidth * precision) / precision;

      if (!this.iconCache[roundedScale]) {
        const ezbImage = new Image();
        ezbImage.src =
          'data:image/svg+xml,%3Csvg width="' +
          roundedScale +
          '" height="60" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"%3E%3Cdefs%3E%3Cfilter ' +
          'x="-9.8%25" y="-37%25" width="119.6%25" height="173.9%25" filterUnits="objectBoundingBox" id="a"%3E%3CfeMorphology radius="1" operator="dilate" ' +
          'in="SourceAlpha" result="shadowSpreadOuter1"/%3E%3CfeOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1"/%3E%3CfeGaussianBlur stdDeviation="4" ' +
          'in="shadowOffsetOuter1" result="shadowBlurOuter1"/%3E%3CfeColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" in="shadowBlurOuter1"/%3E%3C/filter%3E%3Crect ' +
          'id="c" x="8" y="10" width="14" height="14" rx="7"/%3E%3Cpath ' +
          'transform="scale(' + scaleSVGWidth + ', 1)" ' +
          'd="M151.01 0c1.099 0 1.99.9 1.99 2.002v28.996A2.001 2.001 0 01151.01 33H84.5l-7.293 7.293a1 1 0 01-1.414 0L68.5 33H1.99C.891 33 0 32.1 0 30.998V2.002C0 .896.899 0 1.99 0h149.02z" ' +
          'id="b"/%3E%3C/defs%3E%3Cg transform="translate(10 10)" fill="none" fill-rule="evenodd"%3E%3Cuse fill="%23000" filter="url(%23a)" xlink:href="%23b"/%3E%3Cuse fill="%23FFF" ' +
          'xlink:href="%23b"/%3E%3Cuse fill="' +
          this.fillColor +
          '" xlink:href="%23c"/%3E%3C/g%3E%3C/svg%3E%0A';

        this.iconCache[roundedScale] = new Icon({
          anchor: [0.5, 1],
          img: ezbImage,
          imgSize: [roundedScale, 60]
        });
      }

      this.ezbLabelIconStyleSvg.setImage(this.iconCache[roundedScale]);
      this.ezbLabelIconStyleSvg.getText().setText(label);
      this.ezbLabelIconStyleSvg.setZIndex(this.zIndex++); // necessary for grouping text label and icon together
      // we need to return both line and icon styles to display the polygon and the label
      return [this.ezbLabelIconStyleSvg, this.ezbLineStyle];
    }
  }

  private scaleSVGWidth(label: string): number {
    let length = label.length;
    if (length > 12) {
      length = length + 1;
    } else if (length > 7) {
      length = length + 3;
    } else {
      length = length + 5
    }
    return length / 17;
  }

  private scaleLabelWidth(label: string): number {
    const length = label.length;
    const labelWidth = length * 10;
    // adds dynamically width based on label length to the label icon to avoid text exceeding icon
    let x;
    if (length > 12) {
      x = 0;
    } else if (length > 7) {
      x = 25;
    } else {
      x = 35
    }
    return labelWidth + x;
  }
}
