import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export class Styles {

  image = new Circle({
    radius: 5,
    fill: null,
    stroke: new Stroke({
      color: 'red',
      width: 1
    })
  });

  private _point = new Style({
    image: this.image
  });

  private _lineString = new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1
    })
  });

  private _multiLineString = new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1
    })
  });

  private _multiPoint = new Style({
    image: this.image
  });

  private _multiPolygon = new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  });

  private _polygon = new Style({
    stroke: new Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  });

  private _geometryCollection = new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new Fill({
      color: 'magenta'
    }),
    image: new Circle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: 'magenta'
      })
    })
  });

  private _circle = new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  });

  constructor() {
  }

  geoJSONStylesParser(geometryType: string): string {
    return geometryType.charAt(0).toLowerCase() + geometryType.slice(1);
  }

  get circle(): Style {
    return this._circle;
  }
  get geometryCollection(): Style {
    return this._geometryCollection;
  }
  get polygon(): Style {
    return this._polygon;
  }
  get multiPolygon(): Style {
    return this._multiPolygon;
  }
  get multiPoint(): Style {
    return this._multiPoint;
  }
  get multiLineString(): Style {
    return this._multiLineString;
  }
  get lineString(): Style {
    return this._lineString;
  }
  get point(): Style {
    return this._point;
  }
}
