import {Layer} from 'ol/layer';
import {HttpClient} from '@angular/common/http';
import {get as getProjection} from 'ol/proj';
import {getWidth} from 'ol/extent';
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
     * Returns a tilegrid with the definded params for tile grid loading strategy or debugging
     */
    // tslint:disable-next-line:max-line-length
    protected createTileGrid(tileSize: number = 512, resolutionsSize: number = 22, minZoom: number = 0): TileGrid { // default tileSize same as default value of VectorTileSource
        const projExtent = getProjection('EPSG:3857').getExtent(); // target projection of our map
        const resolutions = new Array(resolutionsSize);
        const tileSizeMtrs = getWidth(projExtent) / tileSize;

        for (let i = 0; i < resolutions.length; ++i) {
            resolutions[i] = tileSizeMtrs / Math.pow(2, i);
        }

        return new TileGrid({
            extent: projExtent,
            resolutions,
            tileSize: [tileSize, tileSize],
            minZoom // we have to set the minZoom as initial options as it will not work if it is set later on the grid
        });
    }

    /**
     * Returns Ol vector source for defined url
     * @param url data to load
     * @param tileGrid decides which loading strategy will be applied, bounding box or tile
     * @param options source options
     */
    protected createVectorSource(url: string, tileGrid?: TileGrid, options?: VectorSourceOptions): VectorSource {
        const defaultOptions: VectorSourceOptions = {
            format: FeatureLayer.geoJSONFormat,
            url,
            strategy: tileGrid ? tile(tileGrid) : bbox
        };

        const mergedOptions: VectorSourceOptions = {...defaultOptions, ...options};
        return new VectorSource(mergedOptions);
    }
}
