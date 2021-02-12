import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import {Coordinate} from 'ol/coordinate';
import {fromLonLat} from 'ol/proj';
import {View} from 'ol';
import Layer from 'ol/layer/Layer';
import Collection from 'ol/Collection';
import BaseLayer from 'ol/layer/Base';
import Interaction from 'ol/interaction/Interaction';
import Select from 'ol/interaction/Select';
import Overlay from 'ol/Overlay';
import {Extent} from 'ol/extent';
import OSM from 'ol/source/OSM';

@Injectable({
  providedIn: 'root'
})
export class BaseMapService {

  private _baseMap: Map;

  get baseMap(): Map {
    return this._baseMap;
  }

  private hintergrundkartenLayer: TileLayer;

  private lastImageExtent: Extent;

  constructor() { }

  public createBaseMap(baseMapId: string): Map {
    // initial map position (length) in the EPSG-3857 system
    const longitude = 13.451338;
    // initial map position (width) in the EPSG-3857 system
    const latitude = 52.503707;
    // initial map window zoomlevel
    const zoomStufe = 11;

    this._baseMap = this.createMap(baseMapId, longitude, latitude, zoomStufe);
    this.createHintergrundkartenLayer();
    this.addLayer(this.hintergrundkartenLayer);
    this.hintergrundkartenLayer.setSource(new OSM());

    return this._baseMap;
  }

  private createHintergrundkartenLayer(): void {
    // Hintergrundkarte
    this.hintergrundkartenLayer = new TileLayer();
    this.hintergrundkartenLayer.set('name', 'hintergrundkarte');
    // this.hintergrundkartenLayer.setZIndex(1);
  }

  /**
   * Creates the openlayers map with given parameters.
   * @param targetId HTMLElement id for the map
   * @param longitude position length
   * @param latitude position width
   * @param defaultZoomLevel initial zoomstufe
   */
  private createMap(targetId: string, longitude: number, latitude: number, defaultZoomLevel: number): Map {
    // Map center coordinates in Longitude, Latitude format
    const coordinate = this.createCoordinate(longitude, latitude);

    // view which contains the position and zoom level
    const view = this.createView(coordinate, defaultZoomLevel);

    // create the ol map
    return new Map({
      target: targetId,
      layers: [],
      controls: [],
      view,
    });
  }

  /**
   * Creates a coordiante from incoming longitude and latitude.
   * OpenLayers functionality.
   */
  private createCoordinate(longitude: number, latitude: number): Coordinate {
    return fromLonLat([longitude, latitude]);
  }

  /**
   * Creates a view with initial setup.
   * This setup consists of an initial coordinate and zoomlevel.
   */
  private createView(coordinate: Coordinate, defaultZoomLevel: number): View {
      return new View({
        center: coordinate,
        zoom: defaultZoomLevel
      });
  }

  /**
   * Gets a map size in pixel.
   */
  public getSize(): [number, number] {
    return this.baseMap.getSize();
  }

  /**
   * Adds a layer to base map.
   */
  public addLayer(layer: Layer): void {
    this._baseMap.addLayer(layer);
  }

  /**
   * Removes a layer from the base map.
   *
   * @param layer - Layer to be removed from the base map
   */
  public removeLayer(layer: Layer): void {
    this._baseMap.removeLayer(layer);
  }

  /**
   * Retrieves all layers in base map.
   */
  public getLayers(): Collection<BaseLayer> {
    return this._baseMap.getLayers();
  }

  public getLayer(layerName: string): BaseLayer {
    return this._baseMap.getLayers().getArray().find(layer => layer.get('name') === layerName);
  }

  /**
   * Adds an interaction to base map.
   */
  public addInteraction(interaction: Interaction): void {
    this._baseMap.addInteraction(interaction);
  }

  /**
   * Gets interactions of base map.
   */
  public getInteractions(): Interaction[] {
    return this._baseMap.getInteractions().getArray();
  }

  /**
   * Removes a interaction from base map.
   */
  public removeInteraction(interaction: Interaction): void {
    this._baseMap.removeInteraction(interaction);
  }

  /**
   * Change active state of select interactions.
   */
  public changeSelectInteractionActiveState(active: boolean): void {
    const interactions = this.getInteractions();
    if (interactions) {
      interactions.filter(interaction => (interaction instanceof Select))
          .forEach(interaction => {
            interaction.setActive(active);
          });
    }
  }

  /**
   * Adds an overlay to base map.
   */
  public addOverlay(overlay: Overlay): void {
    this._baseMap.addOverlay(overlay);
  }

  /**
   * Removes a specific overlay from base map.
   */
  public removeOverlay(overlay: Overlay): void {
    this._baseMap.removeOverlay(overlay);
  }

  /**
   * Centers the view of the base-map to given coordinates and sets zoom level to given Zoomstufe.
   * @param coordinate longitude and latitude of a specific point
   * @param zoomStufe zoom level to set
   */
  public centerViewToCoordinates(coordinate: [number, number], zoomStufe: number): void {
    this._baseMap.getView().setCenter(fromLonLat(coordinate));
    this._baseMap.getView().setZoom(zoomStufe);
  }

  /**
   * Get the maps current view
   */
  public getView(): View {
    return this._baseMap.getView();
  }

  /**
   * Sets last image extent
   */
  public setLastImageExtent(imageExtent: Extent): void {
    this.lastImageExtent = imageExtent;
  }
}
