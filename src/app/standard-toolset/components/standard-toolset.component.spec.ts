import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardToolsetComponent } from './standard-toolset.component';
import { MockComponent, MockModule } from 'ng-mocks';
import { MeasuringToolComponent } from './measuring-tool/measuring-tool.component';
import { KartenManagerComponent } from './karten-manager/karten-manager.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StandardToolsetEnum } from '../model/standard-toolset.enum';
import { ScuIconButtonModule } from '../../../components/shared/scu/scu-icon-button/scu-icon-button.module';
import { ScuIconModule } from '../../../components/shared/scu/scu-icon/scu-icon.module';
import { LayerManagerComponent } from './layer-manager/layer-manager.component';
import { ScuCheckboxModule } from '../../../components/shared/scu/scu-checkbox/scu-checkbox.module';
import { ScuTileModule } from '../../../components/shared/scu/scu-tile/scu-tile.module';
import { TranslocoModule } from '@ngneat/transloco';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

describe('StandardToolsetComponent', () => {
  let testee: StandardToolsetComponent;
  let fixture: ComponentFixture<StandardToolsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StandardToolsetComponent,
        MockComponent(MeasuringToolComponent),
        MockComponent(KartenManagerComponent),
        MockComponent(LayerManagerComponent)
      ],
      imports: [
        MockModule(TranslocoModule),
        NoopAnimationsModule,
        ScuIconButtonModule,
        ScuIconModule,
        ScuCheckboxModule,
        ScuTileModule
      ],
      providers: [
        {provide: Store, useFactory: () => instance(mock(Store))},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardToolsetComponent);
    testee = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(testee).toBeTruthy();
  });

  test('should create toolset buttons', () => {
    expect(fixture.nativeElement.querySelector('#measuring-tool-button')).toBeInTheDocument();
  });

  describe('measuring tool button', () => {

    // AB#83415
    test('should activate measuring tool when clicked if deactivated', () => {
      // given that
      const measuringButton = fixture.debugElement.query(By.css('#measuring-tool-button'));
      expect(testee.activeTool).toBeNull();

      // when
      measuringButton.triggerEventHandler('scuclick', {detail: StandardToolsetEnum.MEASURING_TOOL});
      fixture.detectChanges();

      // then
      expect(testee.activeTool).toBe(StandardToolsetEnum.MEASURING_TOOL);
      expect(fixture.nativeElement.querySelector('app-measuring-tool')).toBeInTheDocument();
    });

    // AB#83424
    test('should deactivate measuring tool when clicked if activated', () => {
      // given that
      testee.activeTool = StandardToolsetEnum.MEASURING_TOOL;
      const measuringButton = fixture.debugElement.query(By.css('#measuring-tool-button'));
      expect(testee.activeTool).toBe(StandardToolsetEnum.MEASURING_TOOL);

      // when
      measuringButton.triggerEventHandler('scuclick', {detail: StandardToolsetEnum.MEASURING_TOOL});
      fixture.detectChanges();

      // then
      expect(testee.activeTool).toBeNull();
      expect(fixture.nativeElement.querySelector('app-measuring-tool')).not.toBeInTheDocument();
    });
  });

  describe('karten manager button', () => {

    // AB#88038
    test('should activate karten manager tool when clicked if deactivated', () => {
      // given that
      const measuringButton = fixture.debugElement.query(By.css('#karten-manager-button'));
      expect(testee.activeTool).toBeNull();

      // when
      measuringButton.triggerEventHandler('scuclick', {detail: StandardToolsetEnum.KARTEN_MANAGER});
      fixture.detectChanges();

      // then
      expect(testee.activeTool).toBe(StandardToolsetEnum.KARTEN_MANAGER);
      expect(fixture.nativeElement.querySelector('app-karten-manager')).toBeInTheDocument();
    });

    // AB#88041
    test('should deactivate karten manager when clicked if activated', () => {
      // given that
      testee.activeTool = StandardToolsetEnum.KARTEN_MANAGER;
      const measuringButton = fixture.debugElement.query(By.css('#karten-manager-button'));
      expect(testee.activeTool).toBe(StandardToolsetEnum.KARTEN_MANAGER);

      // when
      measuringButton.triggerEventHandler('scuclick', {detail: StandardToolsetEnum.KARTEN_MANAGER});
      fixture.detectChanges();

      // then
      expect(testee.activeTool).toBeNull();
      expect(fixture.nativeElement.querySelector('app-karten-manager')).not.toBeInTheDocument();
    });

    // AB#88041
    xtest('should close karten manager when DOM Element outside Toolset is clicked', () => {
      // TODO: move to Cypress
      // given that
      testee.activeTool = StandardToolsetEnum.KARTEN_MANAGER;
      document.body.innerHTML = `${document.body.innerHTML}+<div id="testee"></div>`; // add random div to body
      const anyOtherDomElementOutsideToolset = document.getElementById('testee');

      // when
      anyOtherDomElementOutsideToolset.click();
      fixture.detectChanges();

      // then
      expect(testee.activeTool).toBeNull();
      expect(fixture.nativeElement.querySelector('app-karten-manager')).not.toBeInTheDocument();
    });
  });

  describe('layer manager button', () => {

    test('should activate layer manager tool when clicked if deactivated', () => {
      // given that
      const measuringButton = fixture.debugElement.query(By.css('#layer-manager-button'));
      expect(testee.activeTool).toBeNull();

      // when
      measuringButton.triggerEventHandler('scuclick', {detail: StandardToolsetEnum.LAYER_MANAGER});
      fixture.detectChanges();

      // then
      expect(testee.activeTool).toBe(StandardToolsetEnum.LAYER_MANAGER);
      expect(fixture.nativeElement.querySelector('app-layer-manager')).toBeInTheDocument();
    });

    test('should deactivate layer manager when clicked if activated', () => {
      // given that
      testee.activeTool = StandardToolsetEnum.LAYER_MANAGER;
      const measuringButton = fixture.debugElement.query(By.css('#layer-manager-button'));
      expect(testee.activeTool).toBe(StandardToolsetEnum.LAYER_MANAGER);

      // when
      measuringButton.triggerEventHandler('scuclick', {detail: StandardToolsetEnum.LAYER_MANAGER});
      fixture.detectChanges();

      // then
      expect(testee.activeTool).toBeNull();
      expect(fixture.nativeElement.querySelector('app-layer-manager')).not.toBeInTheDocument();
    });

    xtest('should close layer manager when DOM Element outside Toolset is clicked', () => {
      // TODO: move to Cypress
      // given that
      testee.activeTool = StandardToolsetEnum.LAYER_MANAGER;
      document.body.innerHTML = `${document.body.innerHTML}+<div id="testee"></div>`; // add random div to body
      const anyOtherDomElementOutsideToolset = document.getElementById('testee');

      // when
      anyOtherDomElementOutsideToolset.click();
      fixture.detectChanges();

      // then
      expect(testee.activeTool).toBeNull();
      expect(fixture.nativeElement.querySelector('app-layer-manager')).not.toBeInTheDocument();
    });
  });
});
