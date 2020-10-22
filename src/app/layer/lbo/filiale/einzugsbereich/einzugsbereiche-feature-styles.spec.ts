import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import EinzugsbereicheFeatureStyle from './einzugsbereiche-feature-style';

describe('EinzugsbereicheFeatureStyle', () => {

    const feature = new Feature({
        geometry: new Polygon([
            [
                [0, 0],
                [0, 1],
                [0, 2]
            ]]),
        objektNummer: '123456'
    });

    const testee = new EinzugsbereicheFeatureStyle('2695E4');

    test('should create filial style', () => {
        expect(testee).toBeTruthy();
    });

    // AB#78933
    describe('should create style function', () => {
        const styles = testee.getStyleFunction()(feature, 29);

        test('should display ezbs with low resolution', () => {
            expect(styles).toBeInstanceOf(Array);
        });

        test('should create icon style', () => {
            expect(styles[0].getText().getText()).toBe('123456');
        });

        test('should create line style', () => {
            expect(styles[1].getStroke().getColor()).toBe('white');
            expect(styles[1].getFill().getColor()).toBe('2695E4');
        });
    });
});
