import { LayerProps, CompositeLayer, LineLayer, PathLayer, PolygonLayer } from 'deck.gl';
import { LineMapData } from '../../types';
interface Props extends LayerProps {
    getSourcePosition?: (x: LineMapData) => number[];
    getTargetPosition?: (x: LineMapData) => number[];
    getPath?: (x: LineMapData) => number[];
    getPolygon?: (x: LineMapData) => number[];
    getCoordinates?: (x: LineMapData) => number[];
    getElevation?: (x: LineMapData) => number[];
    getColor?: (x: LineMapData) => number[];
    getWidth?: (x: LineMapData) => number;
    getDashArray?: (x: LineMapData) => number[];
    widthUnits?: string;
    widthMinPixels?: number;
    polygonOpacity?: number;
    lineOpacity?: number;
}
export default class LineMapLayer extends CompositeLayer<Props> {
    static defaultProps: {
        id: string;
        pickable: boolean;
        getSourcePosition: (x: LineMapData) => number[];
        getTargetPosition: (x: LineMapData) => number[];
        getPath: (x: LineMapData) => number[];
        getPolygon: (x: LineMapData) => number[];
        getCoordinates: (x: LineMapData) => number[];
        getElevation: (x: LineMapData) => number[] | 3;
        getWidth: (x: LineMapData) => number;
        getColor: (x: LineMapData) => number[];
        getDashArray: (x: LineMapData) => number[];
        widthUnits: string;
        widthMinPixels: number;
        polygonOpacity: number;
        lineOpacity: number;
    };
    static layerName: string;
    renderLayers(): (PolygonLayer<{
        id: string;
        data: any[];
        visible: true;
        opacity: number;
        pickable: boolean;
        extruded: boolean;
        wireframe: boolean;
        getPolygon: (x: LineMapData) => number[];
        getFillColor: (x: LineMapData) => number[];
        getLineColor: any;
        getElevation: (x: LineMapData) => number[];
    }, {}> | PathLayer<{
        id: string;
        data: any[];
        visible: true;
        opacity: number;
        pickable: boolean;
        widthUnits: string;
        widthMinPixels: number;
        rounded: boolean;
        getPath: (x: LineMapData) => number[];
        getColor: (x: LineMapData) => number[];
        getWidth: (x: LineMapData) => number;
        getDashArray: (x: LineMapData) => number[];
    }, {}> | LineLayer<{
        id: string;
        data: any[];
        visible: true;
        opacity: number;
        pickable: boolean;
        getSourcePosition: (x: LineMapData) => number[];
        getTargetPosition: (x: LineMapData) => number[];
        getColor: (x: LineMapData) => number[];
        getWidth: (x: LineMapData) => number;
        widthUnits: string;
        widthMinPixels: number;
    }, {}>)[];
}
export {};
