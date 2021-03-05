import {Layer} from 'ol/layer';
import {HttpClient} from '@angular/common/http';
import {bbox, tile} from 'ol/loadingstrategy';
import TileGrid from 'ol/tilegrid/TileGrid';
import VectorSource, {Options as VectorSourceOptions} from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

/**
 * Abstract base layer implementation for all feature layer
 * generates OL VectorTileSource & VectorSource implementations
 */
export default abstract class FeatureLayer {

    public static readonly LAYER_NAME_PROPERTY = 'name';

    protected static readonly geoJSONFormat = new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });

    protected _layer: Layer;

    protected constructor(protected _http: HttpClient) {}

    get layer(): Layer {
        return this._layer;
    }

    /**
     * Returns Ol vector source for defined url
     * @param url data to load
     * @param tileGrid decides which loading strategy will be applied, bounding box or tile
     * @param options source options
     */
    protected createVectorSource(url?: string, tileGrid?: TileGrid, options?: VectorSourceOptions): VectorSource {
        const defaultOptions: VectorSourceOptions = {
            format: FeatureLayer.geoJSONFormat,
            strategy: tileGrid ? tile(tileGrid) : bbox
        };

        const mergedOptions: VectorSourceOptions = {...defaultOptions, ...options};
        return new VectorSource(mergedOptions);
    }
}
