import ObjekteKeineRealisierungsabsichtLayer from './objekte-keine-realisierungsabsicht-layer';
import { anyString, instance, mock, reset, when } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import VectorSource from 'ol/source/Vector';
import VectorImageLayer from 'ol/layer/VectorImage';
import { getTestDataPointGeoJson } from '../../../../testing/testUtil';
import FeatureLayer from '../../shared/feature-layer';
import { LayerIdentifier } from '../../model/layer-identifier';
import { LayerManagerFacade } from '../../../../store/layer-manager/layer-manager.facade';
import { LayerConfigType } from '../../../../config/layer-config.type';

describe('ObjekteKeineRealisierungsabsichtLayer', () => {
  let testee: ObjekteKeineRealisierungsabsichtLayer;
  const http = mock(HttpClient);
  const layerManagerFacade = mock(LayerManagerFacade);
  const objekteKeineRealisierungsabsichtLayerConfig$ = new Subject<LayerConfigType>();

  beforeEach(() => {
    reset(http);
    when(http.get(anyString())).thenReturn(of(getTestDataPointGeoJson()));
    when(layerManagerFacade.getLayerConfig$(LayerIdentifier.OBJEKTE_KEINE_REALISIERUNGSABSICHT)).thenReturn(objekteKeineRealisierungsabsichtLayerConfig$);
    testee = new ObjekteKeineRealisierungsabsichtLayer(instance(http), instance(layerManagerFacade));
  });

  test('should create vector layer', () => {
    expect(testee).toBeTruthy();
  });

  // AB#78933
  test('should be VectorImageLayer', () => {
    expect(testee.layer).toBeInstanceOf(VectorImageLayer);
  });

  // AB#78980 AB#95345
  test('should set name', () => {
    expect(testee.layer.get(FeatureLayer.LAYER_NAME_PROPERTY)).toBe(LayerIdentifier.OBJEKTE_KEINE_REALISIERUNGSABSICHT);
  });

  // AB#78933 AB#95346
  describe('should set source and style', () => {

    test('set source', () => {
      expect(testee.layer.getSource()).toBeDefined();
      expect(testee.layer.getSource()).toBeInstanceOf(VectorSource);
    });

    test('set style', () => {
      const layerInstance = testee.layer as VectorImageLayer;
      expect(layerInstance.getStyle()).toBeDefined();
      expect(layerInstance.getStyle()).toBeInstanceOf(Function);
    });
  });
});
