import { anyString, instance, mock, reset, resetCalls, when } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import VectorImageLayer from 'ol/layer/VectorImage';
import VectorSource from 'ol/source/Vector';
import { getTestDataPointGeoJson } from '../../../../testing/testUtil';
import { LayerIdentifier } from '../../model/layer-identifier';
import FeatureLayer from '../../shared/feature-layer';
import FilialenEndabgewickeltLayer from './filialen-endabgewickelt-layer';
import { LayerManagerFacade } from '../../../../store/layer-manager/layer-manager.facade';
import { LayerConfigType } from '../../../../config/layer-config.type';

describe('FilialenEndabgewickeltLayer', () => {
  let testee: FilialenEndabgewickeltLayer;
  const http = mock(HttpClient);
  const layerManagerFacade = mock(LayerManagerFacade);
  const filialenEndabgewickeltLayerConfig$ = new Subject<LayerConfigType>();

  beforeEach(() => {
    reset(http);
    when(http.get(anyString())).thenReturn(of(getTestDataPointGeoJson()));
    when(layerManagerFacade.getLayerConfig$(LayerIdentifier.FILIALEN_ENDABGEWICKELT)).thenReturn(filialenEndabgewickeltLayerConfig$);
    testee = new FilialenEndabgewickeltLayer(instance(http), instance(layerManagerFacade));
  });

  afterEach(() => {
    resetCalls(http);
  });

  test('should create vector layer', () => {
    expect(testee).toBeTruthy();
  });

  // AB#78935
  test('should be VectorImageLayer', () => {
    expect(testee.layer).toBeInstanceOf(VectorImageLayer);
  });

  test('should set name', () => {
    expect(testee.layer.get(FeatureLayer.LAYER_NAME_PROPERTY)).toBe(LayerIdentifier.FILIALEN_ENDABGEWICKELT);
  });

  // AB#78935
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
