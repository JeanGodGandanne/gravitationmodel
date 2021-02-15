import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {POI_MARKER_STYLE} from './add-filiale.style';

export default class AddFilialeLayer {
    private _layer: VectorLayer;

    constructor() {
        this.createLayer();
        this._layer.setVisible(true);
        this._layer.setZIndex(11);
    }

    get layer(): VectorLayer {
        return this._layer;
    }

    private createLayer(): void {
        const layer = new VectorLayer({});

        layer.setSource(new VectorSource());
        layer.setStyle(POI_MARKER_STYLE);
        layer.set('name', 'addFilialenLayer');

        this._layer = layer;
    }
}
