import { connect } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import * as Actions from '../actions';
import reducers from '../reducers';
import { ActionTypes, AnalyzedBaseData, InnerProps, RoutePaths, IconDesignation,
  Bounds, MovesbaseFile, Movesbase, MovedData, DepotsData, Viewport,
  GetDepotsOptionFunc, GetMovesOptionFunc, ClickedObject, EventInfo } from '../types';
import { COLOR1 } from '../constants/settings';

const getAverage = (array: number[]) => array.length &&
  array.reduce((previous, current) => previous + current) / array.length;
const radians = (degree: number) => degree * Math.PI / 180;
const degrees = (radian: number) => radian * 180 / Math.PI;

export const getContainerProp = <P>(state: P)  => {
  let prop = {};
  Object.keys(state).forEach((key) => {
    prop = Object.assign({}, prop, { ...state[key] });
  });
  return prop as P;
};

// LoopTime とは１ループにかける時間（ミリ秒）
export const calcLoopTime =
(timeLength : number, secperhour: number) : number => (timeLength / 3600) * 1000 * secperhour;

export const analyzeMovesBase =
(inputData: (Movesbase[] | MovesbaseFile)) : AnalyzedBaseData => {
  let baseTimeBegin: undefined | number;
  let baseTimeLength: undefined | number;
  let baseBounds: undefined | Bounds;
  let basemovesbase: Movesbase[];

  if (Array.isArray(inputData)) { // Array?
    basemovesbase = [...inputData];
  } else {
    baseTimeBegin = inputData.timeBegin;
    baseTimeLength = inputData.timeLength;
    baseBounds = inputData.bounds;
    basemovesbase = [...inputData.movesbase];
  }

  let timeBegin: number = typeof baseTimeBegin === 'number' ? baseTimeBegin : 0;
  let timeLength: number = typeof baseTimeLength === 'number' ? baseTimeLength : 0;
  let bounds: Bounds = typeof baseBounds !== 'undefined' ? baseBounds : {
    westlongitiude: 0, eastlongitiude: 0, southlatitude: 0, northlatitude: 0
  };
  const movesbase: Movesbase[] = basemovesbase;

  if(movesbase.length <= 0){
    return { timeBegin, timeLength, bounds, movesbase, viewport:{} };
  }

  let timeEnd: number = 0;
  const longArray: number[] = [];
  const latiArray: number[] = [];
  for (let i = 0, lengthi = movesbase.length; i < lengthi; i=(i+1)|0) {
    const { operation } = movesbase[i];
    if(!operation || operation.length === 0){
      console.log('movesbase['+i+'] operation undefined');
    }
    for (let j = 0, lengthj = operation.length; j < lengthj; j=(j+1)|0) {
      const { longitude, latitude, position=[longitude, latitude, 3], elapsedtime } = operation[j];
      if(typeof elapsedtime !== 'number'){
        console.log('movesbase['+i+'] operation['+j+'] elapsedtime undefined');
        continue;
      }
      if((typeof operation[j].longitude !== 'number' || typeof operation[j].latitude !== 'number') &&
        typeof operation[j].position === 'undefined'){
        continue;
      }
      if (typeof operation[j].position === 'undefined') {
        operation[j].position = position;
      }
      longArray.push(+position[0]);
      latiArray.push(+position[1]);
      if (!baseBounds && position[0] && position[1]) {
        let { eastlongitiude, westlongitiude, southlatitude, northlatitude } = bounds || null;
        eastlongitiude = !eastlongitiude ? position[0] : Math.max(eastlongitiude, position[0]);
        westlongitiude = !westlongitiude ? position[0] : Math.min(westlongitiude, position[0]);
        southlatitude = !southlatitude ? position[1] : Math.min(southlatitude, position[1]);
        northlatitude = !northlatitude ? position[1] : Math.max(northlatitude, position[1]);
        bounds = { eastlongitiude, westlongitiude, southlatitude, northlatitude };
      }
    }
    movesbase[i].departuretime = operation[0].elapsedtime;
    movesbase[i].arrivaltime = operation[(operation.length-1)|0].elapsedtime;
    movesbase[i].movesbaseidx = i;
    if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
      timeBegin = !timeBegin ? movesbase[i].departuretime : Math.min(timeBegin, movesbase[i].departuretime);
      timeEnd = !timeEnd ? movesbase[i].arrivaltime : Math.max(timeEnd, movesbase[i].arrivaltime);
    }

    let direction = 0;
    for (let j = 0, lengthj = operation.length; j < (lengthj-1); j=(j+1)|0) {
      if(typeof operation[j].position === 'undefined' ||
        typeof operation[(j+1)|0].position === 'undefined'){
        continue;
      }
      const { position: sourcePosition } = operation[j];
      const { position: targetPosition } = operation[(j+1)|0];
      if(sourcePosition[0] === targetPosition[0] && sourcePosition[1] === targetPosition[1]){
        operation[j].direction = direction;
        continue;
      }
      const x1 = radians(sourcePosition[0]);
      const y1 = radians(sourcePosition[1]);
      const x2 = radians(targetPosition[0]);
      const y2 = radians(targetPosition[1]);
      const deltax = x2 - x1;
      direction = degrees(Math.atan2(Math.sin(deltax), 
          Math.cos(y1) * Math.tan(y2) - Math.sin(y1) * Math.cos(deltax))) % 360;
      operation[j].direction = direction;
    }
  }
  if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
    timeLength = timeEnd - timeBegin;
  }else{
    for (let k = 0, lengthk = movesbase.length; k < lengthk; k=(k+1)|0) {
      movesbase[k].departuretime = movesbase[k].departuretime + timeBegin;
      movesbase[k].arrivaltime = movesbase[k].arrivaltime + timeBegin;
      const { operation } = movesbase[k];
      for (let l = 0, lengthl = operation.length; l < lengthl; l=(l+1)|0) {
        operation[l].elapsedtime = operation[l].elapsedtime + timeBegin;
      }
    }
  }
  if(longArray.length > 0 && latiArray.length > 0){
    const viewport: Viewport = {
      longitude: getAverage(longArray), latitude: getAverage(latiArray),
    };
    return { timeBegin, timeLength, bounds, movesbase, viewport };
  }else{
    return { timeBegin, timeLength, bounds, movesbase, viewport:{} };
  }
};

const defDepotsOptionFunc = (props: InnerProps, idx: number) : Object => {
  const {position, longitude, latitude, type, ...retValue} = props.depotsBase[idx];
  return retValue;
};
export const getDepots = (props: InnerProps): DepotsData[] => {
  const { settime, depotsBase, depotsData:prevData, getDepotsOptionFunc } = props;
  if(prevData.length > 0 && (Math.abs(prevData[0].settime - settime) <= 1)){
    if(!getDepotsOptionFunc) return prevData;
  }
  const getOptionFunction: GetDepotsOptionFunc = getDepotsOptionFunc || defDepotsOptionFunc;

  if (depotsBase.length > 0) {
    const depotsData: DepotsData[] = [];
    for (let i = 0, lengthi = depotsBase.length; i < lengthi; i=(i+1)|0) {
      const { type, longitude, latitude, position=[longitude, latitude, 1] } = depotsBase[i];
      depotsData[i] = Object.assign({},
        { settime, position},
        getOptionFunction(props, i),
      );
      if(typeof type === 'string') depotsData[i].type = type;
    }
    return depotsData;
  }
  return [];
};

const defMovesOptionFunc = (props: InnerProps, idx1: number, idx2: number) : Object => {
  const {departuretime, arrivaltime, operation, type, ...retValue1} = props.movesbase[idx1];
  const {elapsedtime, position, longitude, latitude, color, direction, ...retValue2} = operation[idx2];
  return Object.assign(retValue1,retValue2);
};
export const getMoveObjects = (props : InnerProps): MovedData[] => {
  const { movesbase, movedData:prevMovedData, settime, secperhour, timeBegin, timeLength,
    getMovesOptionFunc } = props;
  if(prevMovedData.length > 0){
    if(Math.abs(prevMovedData[0].settime - settime) <= 1 / (secperhour / 144)){
      if(!getMovesOptionFunc) return prevMovedData
    };
  }
  const getOptionFunction: GetMovesOptionFunc = getMovesOptionFunc || defMovesOptionFunc;

  const selectmovesbase = movesbase.filter((data)=>{
    const { departuretime, arrivaltime } = data;
    return (timeBegin > 0 && timeLength > 0 && departuretime <= settime && settime < arrivaltime);
  });
  const movedData: MovedData[] = [];
  for (let i = 0, lengthi = selectmovesbase.length; i < lengthi; i=(i+1)|0) {
    const { operation, movesbaseidx, type } = selectmovesbase[i];
    const idx = operation.findIndex((data)=>data.elapsedtime > settime) - 1;
    const nextidx = (idx+1)|0;
    if(typeof operation[idx].position === 'undefined' ||
      typeof operation[nextidx].position === 'undefined'){
      const {elapsedtime, ...otherProps} = operation[idx];
      movedData[i] = Object.assign({},
        otherProps, { settime, movesbaseidx},
        getOptionFunction(props, movesbaseidx, idx),
      );
    }else{
      const { elapsedtime, position:[longitude, latitude, elevation],
        color=COLOR1, direction=0 } = operation[idx];
      const { elapsedtime: nextelapsedtime, position:[nextlongitude, nextlatitude, nextelevation],
        color: nextcolor=COLOR1 } = operation[nextidx];
      const pos_rate = [longitude, latitude, elevation];
      const rate = (settime - elapsedtime) / (nextelapsedtime - elapsedtime);
      pos_rate[0] = pos_rate[0] - (longitude - nextlongitude) * rate;
      pos_rate[1] = pos_rate[1] - (latitude - nextlatitude) * rate;
      pos_rate[2] = pos_rate[2] - (elevation - nextelevation) * rate;
      movedData[i] = Object.assign({},
        { settime,
          position: pos_rate,
          sourcePosition: [longitude, latitude, elevation],
          targetPosition: [nextlongitude, nextlatitude, nextelevation],
          color, direction,
          sourceColor: color, targetColor: nextcolor,
          movesbaseidx},
        getOptionFunction(props, movesbaseidx, idx),
      );
    }
    if(typeof type === 'string') movedData[i].type = type;
  }
  return movedData;
};

const routeDelete = (movesbaseidx: number, props: {
  routePaths: RoutePaths[], clickedObject: ClickedObject[],
  actions: ActionTypes }): void => {
  const { actions, clickedObject, routePaths } = props;
  if (clickedObject.length > 0 && routePaths.length > 0) {
    if (clickedObject.length === 1) {
      actions.setClicked(null);
      actions.setRoutePaths([]);
    } else {
      const newClickedObject = clickedObject.filter(current => current.object.movesbaseidx !== movesbaseidx);
      actions.setClicked(newClickedObject);
      const newRoutePaths = routePaths.filter(current => current.movesbaseidx !== movesbaseidx);
      actions.setRoutePaths(newRoutePaths);
    }
  }
};

export interface pickParams {
  mode: string,
  info: EventInfo,
}
export const onHoverClick = (pickParams: pickParams, getRouteColor:Function,
  getRouteWidth:Function, iconDesignations:IconDesignation[]): void => {
  const { mode, info } = pickParams;
  const { object, layer } = info;
  const { id, props } = layer;
  if (mode === 'hover' && props.onHover) {
    props.onHover(info);
  }
  if (mode === 'click' || mode === 'query') {
    if (props.onClick) {
      props.onClick(info);
    } else
    if (object && props.actions) {
      const { movesbaseidx } = object;
      const { actions, clickedObject, movesbase, routePaths } = props;
      const replaceGetRouteColor = {};
      if(iconDesignations){
        for (let i = 0, lengthi = iconDesignations.length; i < lengthi; i=(i+1)|0) {
          replaceGetRouteColor[iconDesignations[i].type] = iconDesignations[i].getColor || getRouteColor;
        }
      }
      let deleted = false;
      if (clickedObject && clickedObject.length > 0) {
        if(clickedObject.findIndex((data)=>data.object.movesbaseidx === movesbaseidx) >= 0){
          deleted = true;
        }
      }
      if (deleted) {
        routeDelete(movesbaseidx, props);
      } else {
        const newClickedObject = clickedObject || [];
        newClickedObject.push({ object, layer: { id } });
        const setRoutePaths = [];
        const { type, operation } = movesbase[movesbaseidx];
        let getColor = getRouteColor;
        if(type && replaceGetRouteColor.hasOwnProperty(type)){
          getColor = replaceGetRouteColor[type];
        }
        for (let j = 0; j < (operation.length - 1); j=(j+1)|0) {
          const { position } = operation[j];
          const movedata = { type, ...operation[j] };
          const routeColor = getColor(movedata);
          const routeWidth = getRouteWidth(movedata);
          const { position: nextposition } = operation[(j+1)|0];
          setRoutePaths.push({
            type ,movesbaseidx,
            sourcePosition: position,
            targetPosition: nextposition,
            routeColor: routeColor || COLOR1,
            routeWidth: routeWidth || 10,
          });
        }
        actions.setClicked(newClickedObject);
        actions.setRoutePaths([...routePaths, ...setRoutePaths]);
      }
    }
  }
};

export const checkClickedObjectToBeRemoved = (
  movedData: MovedData[], clickedObject: null | ClickedObject[],
  routePaths: RoutePaths[], actions: ActionTypes): void => {
  if (clickedObject && clickedObject.length > 0 && routePaths.length > 0) {
    for (let i = 0, lengthi = clickedObject.length; i < lengthi; i=(i+1)|0) {
      let deleted = true;
      for (let j = 0, lengthj = movedData.length; j < lengthj; j=(j+1)|0) {
        if (clickedObject[i].object.movesbaseidx === movedData[j].movesbaseidx) {
          deleted = false;
          break;
        }
      }
      if (deleted) {
        routeDelete(clickedObject[i].object.movesbaseidx, { routePaths, clickedObject, actions });
      }
    }
  }
};

export const defaultMapStateToProps = <P>(state: P)  => getContainerProp<P>(state);

export const connectToHarmowareVis = (App, moreActions = null,
  mapStateToProps = defaultMapStateToProps) => {
  const extendedActions = Object.assign({}, Actions, moreActions);

  function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(extendedActions, dispatch) };
  }

  return connect(mapStateToProps, mapDispatchToProps)(App);
};

export const getCombinedReducer = (combined?: object) =>
  combineReducers({ base: reducers, ...combined });
