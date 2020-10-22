import {LayerSource} from '../layer/model/layer-source.enum';

export type LayerConfigType = {
  zIndex: number,
  visible: boolean,
  sourceType?: LayerSource,
  color?: string,
  text_color?: string,
  fill_color?: string,
  stroke_color?: string,
  minZoom?: number
};
