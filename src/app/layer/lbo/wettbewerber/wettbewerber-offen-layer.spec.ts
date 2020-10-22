import { anyString, instance, mock, reset, resetCalls, when } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { TestDataConstants } from '../../../../testing/testUtil';
import VectorSource from 'ol/source/Vector';
import VectorImageLayer from 'ol/layer/VectorImage';
import WettbewerberOffenLayer from './wettbewerber-offen-layer';
import { LayerManagerFacade } from '../../../../store/layer-manager/layer-manager.facade';
import { LayerIdentifier } from '../../model/layer-identifier';
import { LayerConfigType } from '../../../../config/layer-config.type';

describe('WettbewerberOffenLayer', () => {
  let testee: WettbewerberOffenLayer;
  const http = mock(HttpClient);
  const layerManagerFacade = mock(LayerManagerFacade);
  const wettbewerberOffenLayerConfig$ = new Subject<LayerConfigType>();

  beforeEach(() => {
    reset(http);
    when(http.get(anyString())).thenReturn(of(TestDataConstants.TEST_POINT_GEOJSON));
    when(layerManagerFacade.getLayerConfig$(LayerIdentifier.WETTBEWERBER_OFFEN)).thenReturn(wettbewerberOffenLayerConfig$);
    testee = new WettbewerberOffenLayer(instance(http), instance(layerManagerFacade));
  });

  afterEach(() => {
    resetCalls(http);
  });

  test('should create vector layer', () => {
    expect(testee).toBeTruthy();
  });

  // AB#78933
  test('should be VectorImageLayer', () => {
    expect(testee.layer).toBeInstanceOf(VectorImageLayer);
  });

  test('should set name', () => {
    expect(testee.layer.get('name')).toBe('wett_offen');
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
