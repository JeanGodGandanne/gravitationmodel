import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerManagerComponent } from './layer-manager.component';
import { BaseMapService } from '../../../../components/base-map/base-map.service';
import { instance, mock, reset, when } from 'ts-mockito';
import { MockModule } from 'ng-mocks';
import { TranslocoModule } from '@ngneat/transloco';
import { PipesModule } from '../../../../pipes/pipes.module';
import { Hintergrundkarte } from '../../../../model/enum/hintergrundkarte.enum';
import { LayerManagerFacade } from '../../../../store/layer-manager/layer-manager.facade';
import { LayerManagerState } from '../../../../store/layer-manager/layer-manager.reducer';
import { Subject } from 'rxjs';
import { LayerIdentifier } from '../../../layer/model/layer-identifier';
import { ScuCheckboxModule } from '../../../../components/shared/scu/scu-checkbox/scu-checkbox.module';
import { ScuIconModule } from '../../../../components/shared/scu/scu-icon/scu-icon.module';
import { ScuTileModule } from '../../../../components/shared/scu/scu-tile/scu-tile.module';
import { ScuIconButtonModule } from '../../../../components/shared/scu/scu-icon-button/scu-icon-button.module';

describe('LayerManagerComponent', () => {
  let testee: LayerManagerComponent;
  let fixture: ComponentFixture<LayerManagerComponent>;
  const baseMapService = mock(BaseMapService);
  const layerManagerFacade = mock(LayerManagerFacade);

  const layerManagerState$ = new Subject<LayerManagerState>();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LayerManagerComponent],
      imports: [
        MockModule(TranslocoModule),
        MockModule(PipesModule),
        ScuTileModule,
        ScuCheckboxModule,
        ScuIconButtonModule,
        ScuIconModule,
      ],
      providers: [
        {provide: BaseMapService, useFactory: () => instance(baseMapService)},
        {provide: LayerManagerFacade, useFactory: () => instance(layerManagerFacade)},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    reset(baseMapService);
    when(baseMapService.currentlyActiveHintergrundkarteType).thenReturn(Hintergrundkarte.OSM_STANDARD);
    when(layerManagerFacade.layerManagerState$).thenReturn(layerManagerState$);

    fixture = TestBed.createComponent(LayerManagerComponent);
    testee = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should initialize the layer manager', () => {
    // given that
    const layerManagerState = {
      wett_gesch: {
        zIndex: 1
      },
      wett_offen: {
        zIndex: 2
      },
      wett_tmpg: {
        zIndex: 0
      }
    } as LayerManagerState

    // when
    layerManagerState$.next(layerManagerState)

    fixture.detectChanges();

    // then
    expect(fixture.componentInstance.layerManagerEntries.map(entry => entry.layerIdentifier)).toStrictEqual([
      LayerIdentifier.WETTBEWERBER_OFFEN,
      LayerIdentifier.WETTBEWERBER_GESCHLOSSEN,
      LayerIdentifier.WETTBEWERBER_TEMPORAER_GESCHLOSSEN
    ]);
  })

  test('should upadate existing instances of layer manager entriess', () => {
    // given that
    const layerManagerState = {
      wett_gesch: {
        zIndex: 1,
      },
      wett_offen: {
        zIndex: 2,
      },
      wett_tmpg: {
        zIndex: 0,
      }
    } as LayerManagerState

    layerManagerState$.next(layerManagerState)

    fixture.detectChanges();
    const entries = fixture.componentInstance.layerManagerEntries;

    // when
    const newLayerManagerState = {
      wett_gesch: {
        zIndex: 2,
      },
      wett_offen: {
        zIndex: 1,
      },
      wett_tmpg: {
        zIndex: 0,
      }
    } as LayerManagerState

    layerManagerState$.next(newLayerManagerState)

    fixture.detectChanges();

    // then
    expect(fixture.componentInstance.layerManagerEntries.map(entry => entry.layerIdentifier)).toStrictEqual([
      LayerIdentifier.WETTBEWERBER_GESCHLOSSEN,
      LayerIdentifier.WETTBEWERBER_OFFEN,
      LayerIdentifier.WETTBEWERBER_TEMPORAER_GESCHLOSSEN
    ]);
    expect(fixture.componentInstance.layerManagerEntries).toEqual(expect.arrayContaining(entries));
  })
});
