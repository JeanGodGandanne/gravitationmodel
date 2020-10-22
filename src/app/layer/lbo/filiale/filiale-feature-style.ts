import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Feature from 'ol/Feature';
import Icon from 'ol/style/Icon';
import {IconFileFormat} from '../../shared/icon-file-format';

/**
 * Style generator for Filialen
 * Generates dynamic styles for different Filialen based on OL Style-function
 * @Variable filialeStyleSvg high resolution svg icon style for filialen
 * @Variable filialeStylePng lower resolution png icon style for filialen
 * @Variable filialeSelectedStyleSvg high resolution svg icon style for selected filialen
 * @Variable filialeSelectedStylePng lower resolution png icon style for selected filialen
 * @Variable filialeStylePoints lowest resolution OL Circle style array for filialen
 */
export default class FilialeFeatureStyle {

    private zIndex = 0;

    private filialeStyleSvg = new Style();
    private filialeStylePng = new Style();
    private filialeSelectedStyleSvg = new Style();
    private filialeSelectedStylePng = new Style();
    private filialeStylePoints = new Map<PointStyleRadius, Style>(); // stores point styles for specific radius sizes

    private textStyle = new Text({
        text: '',
        textBaseline: 'middle',
        font: 'bold 13px OpenSans-Bold, Open Sans',
        overflow: true,
        offsetY: -30,
    })

    constructor(private backgroundColor: string, private fontColor: string) {
        this.textStyle.setFill(new Fill({
            color: `#${fontColor}`
        }));

        Object.values(PointStyleRadius).forEach((pointRadius: PointStyleRadius) => {
            this.filialeStylePoints.set(pointRadius, new Style({
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

        this.filialeStyleSvg.setText(this.textStyle);
        this.filialeStyleSvg.setImage(this.createTintedIcon(IconFileFormat.SVG, backgroundColor, false));
        this.filialeStylePng.setImage(this.createTintedIcon(IconFileFormat.PNG, backgroundColor, false));
        this.filialeSelectedStyleSvg.setText(this.textStyle);
        this.filialeSelectedStyleSvg.setImage(this.createTintedIcon(IconFileFormat.SVG, backgroundColor, true));
        this.filialeSelectedStylePng.setImage(this.createTintedIcon(IconFileFormat.PNG, backgroundColor, true));
    }

    /**
     * Returns OL style function for specific styles for Filialen depending on feature and resolution
     */
    getStyleFunction(): (feature: Feature, resolution: number) => Style {

        return (feature: Feature, resolution: number): Style => {
            if (feature.getProperties().selected) {
                if (resolution <= 250) {
                    const filialId = feature.getProperties().objektNummer;
                    this.filialeSelectedStyleSvg.getText().setText(filialId);
                    this.filialeSelectedStyleSvg.setZIndex(this.zIndex++); // necessary for grouping text label and icon together
                    return this.filialeSelectedStyleSvg;
                }
                // pin icon as png
                if (resolution <= 500) {
                    return this.filialeSelectedStylePng;
                }
            } else {
                // pin icon as svg
                if (resolution <= 250) {
                    const filialId = feature.getProperties().objektNummer;
                    this.filialeStyleSvg.getText().setText(filialId);
                    this.filialeStyleSvg.setZIndex(this.zIndex++); // necessary for grouping text label and icon together
                    return this.filialeStyleSvg;
                }

                // pin icon as png
                if (resolution <= 500) {
                    return this.filialeStylePng;
                }
            }

            // circle icon
            // TODO selected style above 500 resolution will be defined later
            if (resolution <= 1000) {
                return this.filialeStylePoints.get(PointStyleRadius.LARGE);
            }
            if (resolution <= 2000) {
                return this.filialeStylePoints.get(PointStyleRadius.NORMAL);
            }
            if (resolution <= 5000) {
                return this.filialeStylePoints.get(PointStyleRadius.SMALL);
            }
            if (resolution > 5000) {
                return this.filialeStylePoints.get(PointStyleRadius.TINY);
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
