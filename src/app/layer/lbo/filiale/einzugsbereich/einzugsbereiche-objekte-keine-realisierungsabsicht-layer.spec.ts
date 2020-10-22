import { anyString, instance, mock, reset, resetCalls, when } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import EinzugsbereicheObjekteKeineRealisierungsabsichtLayer
  from './einzugsbereiche-objekte-keine-realisierungsabsicht-layer';
import { of, Subject } from 'rxjs';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { getTestDataPolygonGeoJson } from '../../../../../testing/testUtil';
import FeatureLayer from '../../../shared/feature-layer';
import { LayerIdentifier } from '../../../model/layer-identifier';
import { LayerManagerFacade } from '../../../../../store/layer-manager/layer-manager.facade';
import { LayerConfigType } from '../../../../../config/layer-config.type';

describe('EinzugsbereicheObjekteKeineRealisierungsabsichtLayer', () => {
  let testee: EinzugsbereicheObjekteKeineRealisierungsabsichtLayer;
  const http = mock(HttpClient);
  const layerManagerFacade = mock(LayerManagerFacade);
  const einzugsbereicheObjekteKeineRealisierungsabsichtLayerConfig$ = new Subject<LayerConfigType>();

  beforeEach(() => {
    reset(http);
    when(http.get(anyString())).thenReturn(of(getTestDataPolygonGeoJson()));
    when(layerManagerFacade.getLayerConfig$(LayerIdentifier.EINZUGSBEREICHE_OBJEKTE_KEINE_REALISIERUNGSABSICHT)).thenReturn(einzugsbereicheObjekteKeineRealisierungsabsichtLayerConfig$);
    testee = new EinzugsbereicheObjekteKeineRealisierungsabsichtLayer(instance(http), instance(layerManagerFacade));
  });

  afterEach(() => {
    resetCalls(http);
  });

  test('should create vector tile layer', () => {
    expect(testee).toBeTruthy();
  });

  // AB#78936 AB#79078
  test('should be VectorTileLayer', () => {
    expect(testee.layer).toBeInstanceOf(VectorTileLayer);
  });

  // AB#78980 AB#79079 AB#95334
  test('should set name', () => {
    expect(testee.layer.get(FeatureLayer.LAYER_NAME_PROPERTY)).toBe(LayerIdentifier.EINZUGSBEREICHE_OBJEKTE_KEINE_REALISIERUNGSABSICHT);
  });

  // AB#78933 AB#79079 AB#95335
  describe('should set source and style', () => {

    test('set source', () => {
      expect(testee.layer.getSource()).toBeDefined();
      expect(testee.layer.getSource()).toBeInstanceOf(VectorTileSource);
    });

    test('set style', () => {
      const layerInstance = testee.layer as VectorTileLayer;
      expect(layerInstance.getStyle()).toBeDefined();
      expect(layerInstance.getStyle()).toBeInstanceOf(Function);
    });
  });
});
