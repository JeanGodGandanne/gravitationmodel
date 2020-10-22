import VectorLayer from 'ol/layer/Vector';
import { Options as VectorLayerOptions } from 'ol/layer/BaseVector';
import VectorSource, { Options as VectorSourceOptions } from 'ol/source/Vector';
import GeoJSON, { Options as GeoJsonOptions } from 'ol/format/GeoJSON';
import { Injectable } from '@angular/core';
import { LayerModule } from '../../layer/layer.module';
import Geometry from 'ol/geom/Geometry';
import { Feature } from 'ol';
import { Options as StyleOptions } from 'ol/style/Style';
import { Options as StrokeOptions } from 'ol/style/Stroke';
import { Options as FillOptions } from 'ol/style/Fill';
import { Fill, Stroke, Style } from 'ol/style';

@Injectable({
  providedIn: LayerModule
})
export class OlObjectFactories {

  public newVectorLayer(optOptions?: VectorLayerOptions): VectorLayer { return new VectorLayer(optOptions); };

  public newVectorSource(optOptions?: VectorSourceOptions): VectorSource<Geometry> { return new VectorSource(optOptions); }

  public newGeoJSON(optOptions?: GeoJsonOptions): GeoJSON { return new GeoJSON(optOptions) };

  public newFeature<GeomType extends Geometry = Geometry>(optGeometryOrProperties?: GeomType | { [key: string]: any }): Feature<GeomType> {
    return new Feature(optGeometryOrProperties);
  };

  public newStyle(optOptions?: StyleOptions): Style { return new Style(optOptions); }

  public newStroke(optOptions?: StrokeOptions): Stroke { return new Stroke(optOptions); }

  public newFill(optOptions?: FillOptions): Fill { return new Fill(optOptions); }

}
