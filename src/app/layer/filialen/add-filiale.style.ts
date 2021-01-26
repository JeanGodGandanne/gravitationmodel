import CircleStyle from 'ol/style/Circle';
import {
  Fill, Icon, Stroke, Style
} from 'ol/style';
import { Color } from 'ol/color';

const blue: Color = [0, 121, 206, 1];
const white: Color = [255, 255, 255, 1];

export const POI_INTERACTION_STYLE = new Style({
  image: new CircleStyle({
    radius: 8,
    stroke: new Stroke({
      color: blue,
      width: 2
    }),
    fill: new Fill({
      color: white
    })
  })
});

export const POI_MARKER_STYLE = new Style({
  image: new Icon({
    src: 'assets/geometries/icons/poi.svg',
    anchor: [0.5, 0.88],
  })
});
