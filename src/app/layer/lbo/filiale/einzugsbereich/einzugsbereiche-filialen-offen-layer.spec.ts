import { anyString, instance, mock, reset, resetCalls, when } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import EinzugsbereicheFilialenOffenLayer from './einzugsbereiche-filialen-offen-layer';
import { of, Subject } from 'rxjs';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { getTestDataPolygonGeoJson } from '../../../../../testing/testUtil';
import FeatureLayer from '../../../shared/feature-layer';
import { LayerIdentifier } from '../../../model/layer-identifier';
import { LayerManagerFacade } from '../../../../../store/layer-manager/layer-manager.facade';
import { LayerConfigType } from '../../../../../config/layer-config.type';

describe('EinzugsbereicheFilialenOffenLayer', () => {
  let testee: EinzugsbereicheFilialenOffenLayer;
  const http = mock(HttpClient);
  const layerManagerFacade = mock(LayerManagerFacade);
  const einzugsbereicheFilialenOffenLayerConfig$ = new Subject<LayerConfigType>();

  beforeEach(() => {
    reset(http);
    when(http.get(anyString())).thenReturn(of(getTestDataPolygonGeoJson()));
    when(layerManagerFacade.getLayerConfig$(LayerIdentifier.EINZUGSBEREICHE_FILIALEN_OFFEN)).thenReturn(einzugsbereicheFilialenOffenLayerConfig$);
    testee = new EinzugsbereicheFilialenOffenLayer(instance(http), instance(layerManagerFacade));
  });

  afterEach(() => {
    resetCalls(http);
  });

  test('should create vector tile layer', () => {
    expect(testee).toBeTruthy();
  });

  // AB#78933
  test('should be VectorTileLayer', () => {
    expect(testee.layer).toBeInstanceOf(VectorTileLayer);
  });

  test('should set name', () => {
    expect(testee.layer.get(FeatureLayer.LAYER_NAME_PROPERTY)).toBe(LayerIdentifier.EINZUGSBEREICHE_FILIALEN_OFFEN);
  });

  // AB#78933
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
