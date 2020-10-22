import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import {Circle} from 'ol/style';
import Icon from 'ol/style/Icon';
import WettbewerberFeatureStyle from './wettbewerber-feature-style';

describe('WettbewerberFeatureStyle', () => {

  const feature = new Feature({
    geometry: new Point([0, 0]),
    wettbewerberKuerzel: 'test'
  });

  const featureSelected = new Feature({
    geometry: new Point([0, 0]),
    wettbewerberKuerzel: 'test',
    selected: true
  });
  const testee = new WettbewerberFeatureStyle('FFFFFF', '39AD73');

  test('should create filial style', () => {
    expect(testee).toBeTruthy();
  });

  describe('style function', () => {

    // AB#78933
    test('should create style function', () => {
      expect(testee.getStyleFunction()(feature, 600)).toBeInstanceOf(Style);
    });

    // AB#78933
    test('should create style function for 250 resolution', () => {
      const icon = testee.getStyleFunction()(feature, 250).getImage() as Icon;
      expect(testee.getStyleFunction()(feature, 250).getText().getText()).toBe('test');
      expect(testee.getStyleFunction()(feature, 250).getText().getFill().getColor()).toBe('#39AD73');
      expect(icon.getSrc()).toBe('assets/geometries/icons/PIN.svg');
    });

    test('should create style function for 251 resolution', () => {
      const icon = testee.getStyleFunction()(feature, 251).getImage() as Icon;
      expect(icon.getSrc()).toBe('assets/geometries/icons/PIN.png');
    });

    test('should create style function for 500 resolution', () => {
      const icon = testee.getStyleFunction()(feature, 500).getImage() as Icon;
      expect(icon.getSrc()).toBe('assets/geometries/icons/PIN.png');
    });

    test('should create style function for 501 resolution', () => {
      const image = testee.getStyleFunction()(feature, 501).getImage() as Circle;
      expect(image.getRadius()).toBe(12);
      expect(image.getFill().getColor()).toBe('#FFFFFF');
    });

    test('should create style function for 1000 resolution', () => {
      const image = testee.getStyleFunction()(feature, 1000).getImage() as Circle;
      expect(image.getRadius()).toBe(12);
      expect(image.getFill().getColor()).toBe('#FFFFFF');
    });

    test('should create style function for 1001 resolution', () => {
      const image = testee.getStyleFunction()(feature, 1001).getImage() as Circle;
      expect(image.getRadius()).toBe(9);
      expect(image.getFill().getColor()).toBe('#FFFFFF');
    });

    test('should create style function for 2000 resolution', () => {
      const image = testee.getStyleFunction()(feature, 2000).getImage() as Circle;
      expect(image.getRadius()).toBe(9);
      expect(image.getFill().getColor()).toBe('#FFFFFF');
    });

    test('should create style function for 2001 resolution', () => {
      const image = testee.getStyleFunction()(feature, 2001).getImage() as Circle;
      expect(image.getRadius()).toBe(6);
      expect(image.getFill().getColor()).toBe('#FFFFFF');
    });

    test('should create style function for 5000 resolution', () => {
      const image = testee.getStyleFunction()(feature, 5000).getImage() as Circle;
      expect(image.getRadius()).toBe(6);
      expect(image.getFill().getColor()).toBe('#FFFFFF');
    });

    test('should create style function for >5000 resolution', () => {
      const image = testee.getStyleFunction()(feature, 5001).getImage() as Circle;
      expect(image.getRadius()).toBe(5);
      expect(image.getFill().getColor()).toBe('#FFFFFF');
    });

    test('should create style function for selected features for 250 resolution', () => {
      const icon = testee.getStyleFunction()(featureSelected, 250).getImage() as Icon;
      expect(testee.getStyleFunction()(feature, 250).getText().getText()).toBe('test');
      expect(testee.getStyleFunction()(feature, 250).getText().getFill().getColor()).toBe('#39AD73');
      expect(icon.getSrc()).toBe('assets/geometries/icons/PIN_selected.svg');
    })

    test('should create style function for selected feature for 251 resolution', () => {
      const icon = testee.getStyleFunction()(featureSelected, 251).getImage() as Icon;
      expect(icon.getSrc()).toBe('assets/geometries/icons/PIN_selected.png');
    });

    test('should create style function for selected feature for 500 resolution', () => {
      const icon = testee.getStyleFunction()(featureSelected, 500).getImage() as Icon;
      expect(icon.getSrc()).toBe('assets/geometries/icons/PIN_selected.png');
    });

    // TODO tests for selected features above 500 resolution will be added when style is defined
  });
})
