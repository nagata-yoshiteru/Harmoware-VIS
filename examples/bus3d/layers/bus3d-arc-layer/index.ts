import { LayerProps, ArcLayer } from 'deck.gl';
import { Arcdata } from '../../types';
import { settings } from 'harmoware-vis';
const { COLOR1 } = settings;

interface Props extends LayerProps {
    data: Arcdata[],
    visible?: boolean,
    widthUnits?: string,
    widthScale?: number,
    widthMinPixels?: number,
    getSourcePosition?: (x: Arcdata) => number[],
    getTargetPosition?: (x: Arcdata) => number[],
    getSourceColor?: (x: Arcdata) => number[],
    getTargetColor?: (x: Arcdata) => number[],
    getStrokeWidth?: (x: Arcdata) => number,
    getWidth?: (x: Arcdata) => number,
}

export default class Bus3dArcLayer extends ArcLayer<Props> {

  constructor(props: Props) {
    const setProps = Object.assign({}, Bus3dArcLayer.defaultProps, props);
    const { getWidth, getStrokeWidth, ...otherProps } = setProps;
    super(Object.assign({}, otherProps, { getWidth: getWidth || getStrokeWidth }));
  }

  static defaultProps = {
    visible: true,
    widthUnits: 'meters',
    widthScale: 1,
    widthMinPixels: 0.1,
    getSourcePosition: (x: Arcdata) => x.sourcePosition,
    getTargetPosition: (x: Arcdata) => x.targetPosition,
    getSourceColor: (x: Arcdata) => x.sourceColor || x.color || COLOR1,
    getTargetColor: (x: Arcdata) => x.targetColor || x.color || COLOR1,
    getStrokeWidth: (x: Arcdata) => x.strokeWidth || 1,
  };

  static layerName = 'Bus3dArcLayer';
}
