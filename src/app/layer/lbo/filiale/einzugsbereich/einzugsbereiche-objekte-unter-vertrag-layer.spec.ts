import { anyString, instance, mock, reset, resetCalls, when } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import EinzugsbereicheObjekteUnterVertragLayer from './einzugsbereiche-objekte-unter-vertrag-layer';
import { of, Subject } from 'rxjs';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { getTestDataPolygonGeoJson } from '../../../../../testing/testUtil';
import FeatureLayer from '../../../shared/feature-layer';
import { LayerIdentifier } from '../../../model/layer-identifier';
import { LayerManagerFacade } from '../../../../../store/layer-manager/layer-manager.facade';
import { LayerConfigType } from '../../../../../config/layer-config.type';

describe('EinzugsbereicheObjekteUnterVertragLayer', () => {
  let testee: EinzugsbereicheObjekteUnterVertragLayer;
  const http = mock(HttpClient);
  const layerManagerFacade = mock(LayerManagerFacade);
  const einzugsbereicheObjekteUnterVertragLayerConfig$ = new Subject<LayerConfigType>();

  beforeEach(() => {
    reset(http);
    when(http.get(anyString())).thenReturn(of(getTestDataPolygonGeoJson()));
    when(layerManagerFacade.getLayerConfig$(LayerIdentifier.EINZUGSBEREICHE_OBJEKTE_UNTER_VERTRAG)).thenReturn(einzugsbereicheObjekteUnterVertragLayerConfig$);
    testee = new EinzugsbereicheObjekteUnterVertragLayer(instance(http), instance(layerManagerFacade));
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

  // AB#78936 AB#79078 AB#95337
  test('should set name', () => {
    expect(testee.layer.get(FeatureLayer.LAYER_NAME_PROPERTY)).toBe(LayerIdentifier.EINZUGSBEREICHE_OBJEKTE_UNTER_VERTRAG);
  });

  // AB#78933 AB#79078 AB#95338
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
