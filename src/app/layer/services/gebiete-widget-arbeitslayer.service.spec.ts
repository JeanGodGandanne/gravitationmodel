import { GebieteWidgetArbeitslayerService } from './gebiete-widget-arbeitslayer.service';
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito';
import { LayerManagerFacade } from '../../../store/layer-manager/layer-manager.facade';
import { GebieteWidgetFacade } from '../../../store/gebiete-widget/gebiete-widget.facade';
import { of, ReplaySubject } from 'rxjs';
import { LayerIdentifier } from '../model/layer-identifier';
import { layersConfig } from '../../../config/layer-config';
import VectorSource from 'ol/source/Vector';
import { NGXLogger } from 'ngx-logger';
import { OlObjectFactories } from '../../open-layers/factories/ol-object-factories';
import VectorLayer from 'ol/layer/Vector';
import { FahrzeitenzoneStateExtension } from '../../../store/gebiete-widget/gebiete-widget.reducer';
import { Feature } from 'ol';
import { fakeAsync, tick } from '@angular/core/testing';
import { FahrzeitenzoneDistance } from '../../../model/enum/fahrzeitenzone-distance.enum';
import Circle from 'ol/geom/Circle';
import { quantitativeColors } from '../../dialog/components/color-picker/color-palettes';

describe('GebieteWidgetArbeitslayerService', () => {
  let testee: GebieteWidgetArbeitslayerService;
  const gebieteWidgetFacade = mock(GebieteWidgetFacade);
  const layerManagerFacade = mock(LayerManagerFacade);
  const ngxLogger = mock(NGXLogger);
  const olObjectFactories = mock(OlObjectFactories);

  const mockedVectorLayer = mock(VectorLayer);
  const mockedVectorSource = mock(VectorSource);
  const gebieteWidgetState$ = new ReplaySubject<FahrzeitenzoneStateExtension[]>(1);

  beforeEach(() => {
    when(layerManagerFacade.getLayerConfig$(LayerIdentifier.ARBEITSLAYER)).thenReturn(of(layersConfig[LayerIdentifier.ARBEITSLAYER]));
    when(gebieteWidgetFacade.gebieteWidgetFahrzeitenzonenState$).thenReturn(gebieteWidgetState$);
    when(olObjectFactories.newVectorLayer(anything())).thenReturn(instance(mockedVectorLayer));
    when(mockedVectorSource.getFeatures()).thenReturn([]);
    when(mockedVectorLayer.getSource()).thenReturn(instance(mockedVectorSource));

    testee = new GebieteWidgetArbeitslayerService(instance(layerManagerFacade),
                                                  instance(gebieteWidgetFacade),
                                                  instance(olObjectFactories),
                                                  instance(ngxLogger));
  });

  afterEach(() => {
    testee.ngOnDestroy();
    // @ts-ignore
    resetCalls(mockedVectorSource);
  });

  // AB#106991
  test('should observe new gebiete only', fakeAsync(() => {
    // given that
    const fzz: Partial<FahrzeitenzoneStateExtension>[] = [
      {
        id: 1,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[0],
        contour: false,
        version: 0,
      },
      {
        id: 2,
        color: quantitativeColors[1],
      },
      {
        id: 3,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[1],
        contour: false,
        version: 0
      }
    ];
    const mockedFeature = mock(Feature);
    when(olObjectFactories.newFeature(anything())).thenReturn(instance(mockedFeature));
    when(mockedVectorSource.getFeatureById(1)).thenReturn(undefined);
    when(mockedVectorSource.getFeatureById(2)).thenReturn(undefined);
    when(mockedVectorSource.getFeatureById(3)).thenReturn(instance(mockedFeature));
    when(mockedFeature.get('version')).thenReturn(0);

    // when
    gebieteWidgetState$.next(fzz as FahrzeitenzoneStateExtension[]);
    tick();

    // then
    verify(mockedFeature.setId(1)).once();
    // TODO: deepEquals(style)
    verify(mockedFeature.setStyle(anything())).once();
    verify(mockedFeature.set('visible', true, true)).once();
    verify(mockedFeature.set('version', 0, true)).once();
    verify(mockedFeature.set('color', quantitativeColors[0], true)).once();
    verify(mockedFeature.set('contour', false, true)).once();
    verify(mockedFeature.setGeometry(anything())).never();
    // TODO: deepEquals(feature)
    verify(mockedVectorSource.addFeature(anything())).once();
    verify(mockedVectorSource.removeFeature(anything())).never();
  }));

  // AB#106992
  test('should observe geometry changes only', fakeAsync(() => {
    // given that
    const fzz: Partial<FahrzeitenzoneStateExtension>[] = [
      {
        id: 1,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        version: 0,
      },
      {
        id: 2,
      },
      {
        id: 3,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        version: 1
      }
    ];
    const mockedFeature = mock(Feature);
    when(mockedVectorSource.getFeatureById(1)).thenReturn(instance(mockedFeature)); // feature exists
    when(mockedVectorSource.getFeatureById(2)).thenReturn(undefined); // feature not exists
    when(mockedVectorSource.getFeatureById(3)).thenReturn(instance(mockedFeature)); // feature exists
    when(mockedFeature.get('version')).thenReturn(0);

    // when
    gebieteWidgetState$.next(fzz as FahrzeitenzoneStateExtension[]);
    tick();

    // then
    verify(mockedFeature.setGeometry(anything())).once();
    verify(mockedFeature.set('version', 1, true)).once();
    verify(mockedFeature.setId(anything())).never();
    verify(mockedFeature.setStyle(anything)).never();
    verify(mockedFeature.set('visible', anything(), anything())).never();
    verify(mockedVectorSource.removeFeature(anything())).never();
  }));

  // AB#106994, AB#106995
  test('should observe visibility changes only', fakeAsync(() => {
    // given that
    const fzz: Partial<FahrzeitenzoneStateExtension>[] = [
      {
        id: 1,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[0],
        contour: false,
        version: 0,
        visible: true,
      },
      {
        id: 2,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[0],
        contour: false,
        version: 0,
        visible: false,
      },
      {
        id: 3,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[1],
        contour: true,
        version: 0,
        visible: false,
      },
      {
        id: 4,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[2],
        contour: true,
        version: 0,
        visible: true,
      }
    ];
    const mockedFeatureId1 = mock(Feature);
    when(mockedVectorSource.getFeatureById(1)).thenReturn(instance(mockedFeatureId1)); // feature exists
    when(mockedFeatureId1.get('visible')).thenReturn(true);
    when(mockedFeatureId1.get('version')).thenReturn(0);
    when(mockedFeatureId1.get('color')).thenReturn(quantitativeColors[0].value);
    when(mockedFeatureId1.get('contour')).thenReturn(false);

    const mockedFeatureId2 = mock(Feature);
    const mockedFeatureId2Instance = instance(mockedFeatureId2);
    when(mockedVectorSource.getFeatureById(2)).thenReturn(undefined); // feature not exists
    when(olObjectFactories.newFeature(anything())).thenReturn(mockedFeatureId2Instance);

    const mockedFeatureId3 = mock(Feature);
    when(mockedVectorSource.getFeatureById(3)).thenReturn(instance(mockedFeatureId3)); // feature exists
    when(mockedFeatureId3.get('visible')).thenReturn(true);
    when(mockedFeatureId3.get('version')).thenReturn(0);
    when(mockedFeatureId3.get('color')).thenReturn(quantitativeColors[1].value);
    when(mockedFeatureId3.get('contour')).thenReturn(false);

    const mockedFeatureId4 = mock(Feature);
    when(mockedVectorSource.getFeatureById(4)).thenReturn(instance(mockedFeatureId4)); // feature exists
    when(mockedFeatureId4.get('visible')).thenReturn(false);
    when(mockedFeatureId4.get('version')).thenReturn(0);
    when(mockedFeatureId4.get('color')).thenReturn(quantitativeColors[2].value);
    when(mockedFeatureId4.get('contour')).thenReturn(false);

    // when
    gebieteWidgetState$.next(fzz as FahrzeitenzoneStateExtension[]);
    tick();

    // then
    // feature 1 bleibt wie es ist
    verify(mockedFeatureId1.setStyle(anything())).never();
    verify(mockedFeatureId1.set('visible', anything(), anything())).never();
    verify(mockedFeatureId1.setGeometry(anything())).never(); // observe geometry not triggered
    verify(mockedFeatureId1.set('color', anything(), anything())).never(); // observe color not triggered
    verify(mockedFeatureId1.set('contour', anything(), anything())).never(); // observe contour not triggered
    // feature 2 hat keine Geometry => bleibt wie es ist
    // feature 3 wird unsichtbar
    // TODO: deepEqual(style)
    verify(mockedFeatureId3.setStyle(anything())).once();
    verify(mockedFeatureId3.set('visible', false, true)).once();
    verify(mockedFeatureId3.setGeometry(anything())).never(); // observe geometry not triggered
    verify(mockedFeatureId3.set('color', anything(), anything())).never(); // observe color not triggered
    verify(mockedFeatureId3.set('contour', anything(), anything())).never(); // observe contour not triggered
    // feature 4 wird sichtbar
    verify(mockedFeatureId4.setStyle(anything())).once();
    verify(mockedFeatureId4.set('visible', true, true)).once();
    verify(mockedFeatureId4.setGeometry(anything())).never(); // observe geometry not triggered
    verify(mockedFeatureId4.set('color', quantitativeColors[2].value, true)).once();
    verify(mockedFeatureId4.set('contour', true, true)).once();
    // keine features werden gelöscht
    verify(mockedVectorSource.removeFeature(anything())).never();
    // feature(id:2) wird hinzugefügt
    verify(mockedVectorSource.addFeature(mockedFeatureId2Instance)).once();
  }));

  // AB#106993, AB#109778
  test('should observe color changes only', fakeAsync(() => {
    // given that
    const fzz: Partial<FahrzeitenzoneStateExtension>[] = [
      {
        id: 1,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[0],
        contour: false,
        visible: true,
      },
      {
        id: 2,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[4],
        contour: false,
        visible: true,
      },
      {
        id: 3,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[5],
        contour: true,
        visible: false,
      },
      {
        id: 4,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[3],
        contour: true,
        visible: false,
      },
    ];
    // a contour does not change
    const mockedFeatureId1 = mock(Feature); // no color change feature exist in source and is visible
    when(mockedVectorSource.getFeatureById(1)).thenReturn(instance(mockedFeatureId1));
    when(mockedFeatureId1.get('visible')).thenReturn(true);
    when(mockedFeatureId1.get('color')).thenReturn(quantitativeColors[0].value);
    when(mockedFeatureId1.get('contour')).thenReturn(false);

    const mockedFeatureId2 = mock(Feature); // color change feature exist in source and is visible
    when(mockedVectorSource.getFeatureById(2)).thenReturn(instance(mockedFeatureId2)); // feature not exists
    when(mockedFeatureId2.get('visible')).thenReturn(true);
    when(mockedFeatureId2.get('color')).thenReturn(quantitativeColors[1].value);
    when(mockedFeatureId2.get('contour')).thenReturn(false);

    const mockedFeatureId3 = mock(Feature); // color change feature exist in source but is invisible
    when(mockedVectorSource.getFeatureById(3)).thenReturn(instance(mockedFeatureId3)); // feature exists
    when(mockedFeatureId3.get('visible')).thenReturn(false);
    when(mockedFeatureId3.get('color')).thenReturn(quantitativeColors[2].value);
    when(mockedFeatureId3.get('contour')).thenReturn(true);

    const mockedFeatureId4 = mock(Feature); // feature does not exist in source
    const mockedFeatureId4Instance = instance(mockedFeatureId4);
    when(mockedVectorSource.getFeatureById(4)).thenReturn(undefined);
    when(olObjectFactories.newFeature(anything())).thenReturn(mockedFeatureId4Instance);

    // when
    gebieteWidgetState$.next(fzz as FahrzeitenzoneStateExtension[]);
    tick();

    // then

    // feature 1 bleibt wie es ist
    verify(mockedFeatureId1.setStyle(anything())).never();
    verify(mockedFeatureId1.set('color', anything(), anything())).never();
    verify(mockedFeatureId1.set('contour',  anything(), anything())).never();

    // feature 2 ändert seine Farbe
    // TODO: deepEqual(style)
    verify(mockedFeatureId2.setStyle(anything())).once();
    verify(mockedFeatureId2.set('color', quantitativeColors[4].value, true)).once();
    verify(mockedFeatureId2.set('contour', anything(), anything())).never();

    // feature 3 ändert nicht seine Farbe
    // TODO: deepEqual(style)
    verify(mockedFeatureId3.setStyle(anything())).never();
    verify(mockedFeatureId3.set('color', anything(), anything())).never();
    verify(mockedFeatureId3.set('contour', anything(), anything())).never();

    // feature 4 existiert noch nicht und wird erstellt
    verify(mockedVectorSource.addFeature(mockedFeatureId4Instance)).once();
  }));

  // AB#106993, AB#109778
  test('should observe contour changes only', fakeAsync(() => {
    // given that
    const fzz: Partial<FahrzeitenzoneStateExtension>[] = [
      {
        id: 1,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[0],
        contour: false,
        visible: true,
      },
      {
        id: 2,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[4],
        contour: false,
        visible: true,
      },
      {
        id: 3,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[5],
        contour: true,
        visible: false,
      },
      {
        id: 4,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[3],
        contour: true,
        visible: false,
      },
    ];
    const mockedFeatureId1 = mock(Feature); // a color change but no contour change of feature in a source and it is visible
    when(mockedVectorSource.getFeatureById(1)).thenReturn(instance(mockedFeatureId1));
    when(mockedFeatureId1.get('visible')).thenReturn(true);
    when(mockedFeatureId1.get('color')).thenReturn(quantitativeColors[1].value);
    when(mockedFeatureId1.get('contour')).thenReturn(false);

    const mockedFeatureId2 = mock(Feature); // no color change but a contour change of feature in a source and it is visible
    when(mockedVectorSource.getFeatureById(2)).thenReturn(instance(mockedFeatureId2)); // feature not exists
    when(mockedFeatureId2.get('visible')).thenReturn(true);
    when(mockedFeatureId2.get('color')).thenReturn(quantitativeColors[4].value);
    when(mockedFeatureId2.get('contour')).thenReturn(true);

    const mockedFeatureId3 = mock(Feature); // color change feature exist in source but is invisible
    when(mockedVectorSource.getFeatureById(3)).thenReturn(instance(mockedFeatureId3)); // feature exists
    when(mockedFeatureId3.get('visible')).thenReturn(false);
    when(mockedFeatureId3.get('color')).thenReturn(quantitativeColors[2].value);
    when(mockedFeatureId3.get('contour')).thenReturn(true);

    const mockedFeatureId4 = mock(Feature); // feature does not exist in source
    const mockedFeatureId4Instance = instance(mockedFeatureId4);
    when(mockedVectorSource.getFeatureById(4)).thenReturn(undefined);
    when(olObjectFactories.newFeature(anything())).thenReturn(mockedFeatureId4Instance);

    // when
    gebieteWidgetState$.next(fzz as FahrzeitenzoneStateExtension[]);
    tick();

    // then

    // feature 1 Farbe ändert sich, der Konturflag nicht
    verify(mockedFeatureId1.setStyle(anything())).once();
    verify(mockedFeatureId1.set('color', quantitativeColors[0].value, true)).once();
    verify(mockedFeatureId1.set('contour',  anything(), anything())).never();

    // feature 2 Farbe ändert sich nicht, der Konturflag aber schon
    // TODO: deepEqual(style)
    verify(mockedFeatureId2.setStyle(anything())).once();
    verify(mockedFeatureId2.set('color', anything(), anything())).never();
    verify(mockedFeatureId2.set('contour', false, true)).once();

    // feature 3 ändern sich weder die Farbe noch der Konturflag
    // TODO: deepEqual(style)
    verify(mockedFeatureId3.setStyle(anything())).never();
    verify(mockedFeatureId3.set('color', anything(), anything())).never();
    verify(mockedFeatureId3.set('contour', anything(), anything())).never();

    // feature 4 existiert noch nicht und wird erstellt
    verify(mockedVectorSource.addFeature(mockedFeatureId4Instance)).once();
  }));

  // AB#106996
  test('should observe delete gebiete only', fakeAsync(() => {
    // given that
    const fzz: Partial<FahrzeitenzoneStateExtension>[] = [
      {
        id: 1,
        geometry: new Feature({
          name: FahrzeitenzoneDistance.LUFTLINIE,
          geometry: new Circle([0,1], 5)
        }),
        color: quantitativeColors[0],
        version: 0,
        visible: true,
      },
    ];
    const mockedFeatureId1 = mock(Feature);
    const mockedFeatureId1Instance = instance(mockedFeatureId1);
    when(mockedVectorSource.getFeatureById(1)).thenReturn(mockedFeatureId1Instance)
    when(mockedFeatureId1.getId()).thenReturn(1);
    when(mockedFeatureId1.get('version')).thenReturn(0);

    const mockedFeatureId2 = mock(Feature);
    const mockedFeatureId2Instance = instance(mockedFeatureId2);
    when(mockedFeatureId2.getId()).thenReturn(2);

    const mockedFeatures = [mockedFeatureId1Instance, mockedFeatureId2Instance];
    when(mockedVectorSource.getFeatures()).thenReturn(mockedFeatures);

    // when
    gebieteWidgetState$.next(fzz as FahrzeitenzoneStateExtension[]);
    tick();

    // then
    verify(mockedVectorSource.removeFeature(mockedFeatureId1Instance)).never();
    verify(mockedVectorSource.removeFeature(mockedFeatureId2Instance)).once();
    // observe geometry not triggered
    verify(mockedFeatureId1.setGeometry(anything())).never();
    // observe visibility and color not triggered
    verify(mockedFeatureId1.set('visible', anything(), anything())).never();
    verify(mockedFeatureId1.set('color', anything(), anything())).never();
    // observe new fzz not triggered
    verify(mockedVectorSource.addFeature(mockedFeatureId1Instance)).never();
  }));
});
