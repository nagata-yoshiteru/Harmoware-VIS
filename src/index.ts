import {
  addMinutes,
  setTime,
  setLeading,
  setTrailing,
  setViewport,
  setDefaultViewport,
  setMovesBase,
  setDepotsBase,
  setDepotsTextBase,
  setAnimatePause,
  setAnimateReverse,
  setSecPerHour,
  setClicked,
  setRoutePaths,
  setDefaultZoom,
  setDefaultPitch,
  setMovesOptionFunc,
  setDepotsOptionFunc,
  setLoading,
  increaseTime,
  decreaseTime,
  setFrameTimestamp,
  setTimeStamp,
  setLinemapData,
  setInputFilename,
  updateMovesBase,
  setNoLoop,
  setInitialViewChange,
} from './actions';

import {
  BasedState,
  BasedProps,
  Bounds,
  ClickedObject,
  Depotsbase,
  DepotsTextbase,
  DepotsData,
  DepotsTextData,
  IconDesignation,
  MovedData,
  Movesbase,
  MovesbaseOperation,
  RoutePaths,
  Viewport,
  LineMapData,
  ActionsInterface,
  EventInfo
} from './types';

import MovesInput from './components/moves-input';
import DepotsInput from './components/depots-input';
import DepotsTextInput from './components/depots-text-input';
import LinemapInput from './components/linemap-input';
import LoadingIcon from './components/loading-icon';
import AddMinutesButton from './components/addminutes-button';
import ElapsedTimeRange from './components/elapsedtime-range';
import ElapsedTimeValue from './components/elapsedtime-value';
import PlayButton from './components/play-button';
import PauseButton from './components/pause-button';
import ReverseButton from './components/reverse-button';
import ForwardButton from './components/forward-button';
import SimulationDateTime from './components/simulation-date-time';
import SpeedRange from './components/speed-range';
import SpeedValue from './components/speed-value';
import HarmoVisLayers from './components/harmovislayers';
import NavigationButton from './components/navigation-button';
import FpsDisplay from './components/fps-display';
import MovesLayer from './layers/moves-layer';
import DepotsLayer from './layers/depots-layer';
import DepotsTextLayer from './layers/depots-text-layer';
import LineMapLayer from './layers/line-map-layer';
import * as settings from './constants/settings';
import Container from './containers';
import reducer from './reducers';
import { connectToHarmowareVis, getContainerProp, getCombinedReducer } from './library';

const Actions: ActionsInterface = {
  addMinutes,
  setTime,
  setLeading,
  setTrailing,
  setViewport,
  setDefaultViewport,
  setMovesBase,
  setDepotsBase,
  setDepotsTextBase,
  setAnimatePause,
  setAnimateReverse,
  setSecPerHour,
  setClicked,
  setRoutePaths,
  setDefaultZoom,
  setDefaultPitch,
  setMovesOptionFunc,
  setDepotsOptionFunc,
  setLoading,
  increaseTime,
  decreaseTime,
  setFrameTimestamp,
  setTimeStamp,
  setLinemapData,
  setInputFilename,
  updateMovesBase,
  setNoLoop,
  setInitialViewChange,
};

export {
  // actions
  Actions,
  // components
  MovesInput,
  DepotsInput,
  DepotsTextInput,
  LinemapInput,
  LoadingIcon,
  AddMinutesButton,
  PlayButton,
  PauseButton,
  ForwardButton,
  ReverseButton,
  ElapsedTimeRange,
  ElapsedTimeValue,
  SpeedRange,
  SpeedValue,
  SimulationDateTime,
  HarmoVisLayers,
  NavigationButton,
  FpsDisplay,
  // constants
  settings,
  // container
  Container,
  // layers
  MovesLayer,
  DepotsLayer,
  DepotsTextLayer,
  LineMapLayer,
  // library
  getContainerProp,
  connectToHarmowareVis,
  getCombinedReducer,
  // reducer
  reducer,
  // types
  BasedState,
  BasedProps,
  Bounds,
  ClickedObject,
  Depotsbase,
  DepotsTextbase,
  DepotsData,
  DepotsTextData,
  IconDesignation,
  MovedData,
  MovesbaseOperation,
  Movesbase,
  RoutePaths,
  Viewport,
  LineMapData,
  ActionsInterface,
  EventInfo
};