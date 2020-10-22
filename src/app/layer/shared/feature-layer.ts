import { Layer } from 'ol/layer';
import { HttpClient } from '@angular/common/http';
import { get as getProjection } from 'ol/proj';
import { getWidth } from 'ol/extent';
import { bbox, tile } from 'ol/loadingstrategy';
import { transformExtent } from 'ol/proj';
import { containsExtent } from 'ol/extent';
import TileGrid from 'ol/tilegrid/TileGrid';
import VectorTile from 'ol/VectorTile';
import VectorTileSource, { Options as VectorTileSourceOptions } from 'ol/source/VectorTile';
import VectorSource, { Options as VectorSourceOptions } from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

/**
 * Abstract base layer implementation for all feature layer
 * generates OL VectorTileSource & VectorSource implementations
 */
export default abstract class FeatureLayer {

    public static readonly LAYER_NAME_PROPERTY = 'name';

    protected static readonly geoJSONFormat = new GeoJSON({
        featureProjection: 'EPSG:3857' // target projection of our map
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
     * Returns OL vector tile source for defined url
     */
    protected createVectorTileSource(baseUrl: string, options?: VectorTileSourceOptions): VectorTileSource {
        const defaultOptions: VectorTileSourceOptions = {
            format: FeatureLayer.geoJSONFormat,
            url: baseUrl + '/tiles/{z}/{x}/{y}',
            tileLoadFunction: (vectorTile: VectorTile, url: string) => {
                this._http.get(url).subscribe((data) => vectorTile.setFeatures(FeatureLayer.geoJSONFormat.readFeatures(data)),
                                              (error) => vectorTile.onError()
                );
            }
        };

        const mergedOptions: VectorTileSourceOptions = {...defaultOptions, ...options};
        return new VectorTileSource(mergedOptions);
    }

    /**
     * Returns Ol vector source for defined url
     * @param tileGrid decides which loading strategy will be applied, bounding box or tile
     */
    protected createVectorSource(baseUrl: string, tileGrid?: TileGrid, options?: VectorSourceOptions): VectorSource {
        const defaultOptions: VectorSourceOptions = {
            format: FeatureLayer.geoJSONFormat,
            loader: (extent, resolution, projection) => {
                const wgs84Extent = transformExtent(extent, projection.getCode(), 'EPSG:4326');
                const minX = wgs84Extent[0];
                const minY = wgs84Extent[1];
                const maxX = wgs84Extent[2];
                const maxY = wgs84Extent[3];

                const url = baseUrl + '/bbox?' + 'minX=' + minX + '&minY=' + minY + '&maxX=' + maxX + '&maxY=' + maxY;
              // tslint:disable-next-line:max-line-length
                if (!containsExtent(vectorSource.getExtent(), extent) || // prevent requsts if features of extent are already loaded, assuming there is no more detail data to load
                    !vectorSource.getFeaturesInExtent(extent)) {         // this helps especially when zooming in to reduce additional requests

                    this._http.get(url).subscribe(
                        (data)  => {
                            const readFeatures = FeatureLayer.geoJSONFormat.readFeatures(data);
                            vectorSource.addFeatures(readFeatures);
                        },
                        (error) => vectorSource.removeLoadedExtent(extent)
                    );
                }
            },
            strategy: tileGrid ? tile(tileGrid) : bbox
        };

        const mergedOptions: VectorSourceOptions = {...defaultOptions, ...options};
        const vectorSource = new VectorSource(mergedOptions);

        return vectorSource;
    }
}
