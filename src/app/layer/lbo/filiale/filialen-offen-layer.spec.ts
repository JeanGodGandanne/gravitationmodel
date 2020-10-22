import FilialenOffenLayer from './filialen-offen-layer';
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

describe('FilialenOffenLayer', () => {
  let testee: FilialenOffenLayer;
  const http = mock(HttpClient);
  const layerManagerFacade = mock(LayerManagerFacade);
  const filaleOffenLayerConfig$ = new Subject<LayerConfigType>();

  beforeEach(() => {
    reset(http);
    when(http.get(anyString())).thenReturn(of(getTestDataPointGeoJson()));
    when(layerManagerFacade.getLayerConfig$(LayerIdentifier.FILIALEN_OFFEN)).thenReturn(filaleOffenLayerConfig$);
    testee = new FilialenOffenLayer(instance(http), instance(layerManagerFacade));
  });

  test('should create vector layer', () => {
    expect(testee).toBeTruthy();
  });

  // AB#78933
  test('should be VectorImageLayer', () => {
    expect(testee.layer).toBeInstanceOf(VectorImageLayer);
  });

  test('should set name', () => {
    expect(testee.layer.get(FeatureLayer.LAYER_NAME_PROPERTY)).toBe(LayerIdentifier.FILIALEN_OFFEN);
  });

  // AB#78933
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
