import * as BaseActions from '../actions';

export interface Viewport {
  longitude?: number,
  latitude?: number,
  zoom?: number,
  maxZoom?: number,
  minZoom?: number,
  pitch?: number,
  bearing?: number,
  width?: number,
  height?: number,
};

export interface Bounds {
  westlongitiude: number,
  eastlongitiude: number,
  southlatitude: number,
  northlatitude: number
};

export interface MovesbaseOperation {
  elapsedtime: number,
  longitude?: number,
  latitude?: number,
  position?: number[],
  direction?: number,
  color?: void | number[],
};

export interface Movesbase {
  type?: string,
  departuretime: number,
  arrivaltime: number,
  operation: MovesbaseOperation[],
  movesbaseidx?: number
};

export interface MovesbaseFile {
  timeBegin?: number,
  timeLength?: number,
  bounds?: Bounds,
  movesbase: Movesbase[],
};

export interface AnalyzedBaseData extends MovesbaseFile {
  viewport: Viewport
};

export interface Depotsbase {
  longitude?: number,
  latitude?: number,
  position?: number[]
};

export interface ClickedObject {
  object: {movesbaseidx: number},
  layer: {id: string}
};

export interface RoutePaths {
  movesbaseidx?: number,
  sourcePosition: number[],
  targetPosition: number[],
  color?: number[]
};

export interface LineMapData {
  sourcePosition?: number[],
  targetPosition?: number[],
  color?: number[],
  path?: number[],
  polygon?: number[],
  coordinates?: number[],
  elevation?: number[],
  strokeWidth?: number,
  dash?: number[],
};

export interface MovedData {
  movesbaseidx: number,
  type?: string,
  position: number[],
  longitude?: number,
  latitude?: number,
  sourcePosition: number[],
  targetPosition: number[],
  direction?: number,
  sourceColor: number[],
  targetColor: number[],
  radius?: number,
  color?: (number | number[])[],
  settime?: number,
  routeColor?: number[],
  routeWidth?: number,
  optColor?: number[],
  optElevation?: number[],
  archWidth?: number,
};

export interface DepotsData {
  position: number[],
  longitude?: number,
  latitude?: number,
  radius?: number,
  color?: (number | number[])[],
  optColor?: number[],
  optElevation?: number[],
};

export interface IconDesignation {
  type: string,
  layer: string,
  radiusScale?: number,
  getColor?: (x: MovedData) => number[],
  getOrientation?: (x: MovedData) => number[],
  getScale?: (x: MovedData) => number[],
  getTranslation?: (x: MovedData) => number[],
  getRadius?: (x: MovedData) => number,
  sizeScale?: number,
  mesh?: any,
  scenegraph?: any,
};

export interface BasedState {
  animatePause?: boolean,
  animateReverse?: boolean,
  beforeFrameTimestamp?: number,
  bounds?: Bounds,
  clickedObject?: null | ClickedObject[],
  defaultPitch?: number,
  defaultZoom?: number,
  depotsBase?: Depotsbase[],
  depotsData?: DepotsData[],
  getDepotsOptionFunc?: null | (<P>(props: P, i: number) => object),
  getMovesOptionFunc?: null | (<P>(props: P, i: number, j: number) => object),
  leading?: number,
  loopTime?: number,
  movedData?: MovedData[],
  movesbase?: Movesbase[],
  routePaths?: RoutePaths[],
  secperhour?: number,
  settime?: number,
  starttimestamp?: number,
  timeBegin?: number,
  timeLength?: number,
  trailing?: number,
  viewport?: Viewport,
  linemapData?: LineMapData[],
  loading?: boolean,
  inputFileName?: ComObj<string>,
};

export type ActionTypes = typeof BaseActions;

export interface ActionsInterface extends ActionTypes { }

export interface BasedProps extends BasedState {
  actions?: ActionTypes
};

export type GetDepotsOptionFunc = ((props: BasedProps, i: number) => object);

export type GetMovesOptionFunc = ((props: BasedProps, i: number, j: number) => object);

export interface EventInfo extends React.MouseEvent<HTMLButtonElement> {
  object: {
      movesbaseidx: number
  },
  layer: {
    id: string,
    props: {
      movesbase: Movesbase[],
      routePaths: RoutePaths[],
      actions: ActionTypes,
      clickedObject: ClickedObject[],
      onHover?: (event: React.MouseEvent<HTMLButtonElement>) => void,
      onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    }
  },
  x: number,
  y: number,
}

interface ComObj<T> {
  [propName: string]: T,
}
