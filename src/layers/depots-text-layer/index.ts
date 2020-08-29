import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { LayerProps, CompositeLayer } from '@deck.gl/core';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { IcoSphereGeometry } from '@luma.gl/engine'
import CubeGraphLayer from '../cubegraph-layer';
import { COLOR4 } from '../../constants/settings';
import { LayerTypes, IconDesignation, DepotsTextData } from '../../types';

interface Props extends LayerProps {
  iconlayer?: LayerTypes,
  iconChange?: boolean,
  layerRadiusScale?: number,
  layerOpacity?: number,
  depotsTextData: DepotsTextData[],
  optionVisible?: boolean,
  optionChange?: boolean,
  optionOpacity?: number,
  optionCellSize?: number,
  optionElevationScale?: number,
  optionCentering?: boolean,
  optionDisplayPosition?: number,
  iconDesignations?: IconDesignation[],
  getColor?: (x: DepotsTextData) => number[],
  getRadius?: (x: DepotsTextData) => number,
  getCubeColor?: (x: DepotsTextData) => number[][],
  getCubeElevation?: (x: DepotsTextData) => number[],
  mesh?: any,
  meshSizeScale?: number,
  getOrientation?: (x: DepotsTextData) => number[],
  getScale?: (x: DepotsTextData) => number[],
  getTranslation?: (x: DepotsTextData) => number[],
}

const defaultmesh = new IcoSphereGeometry();

export default class DepotsTextLayer extends CompositeLayer<Props> {
  constructor(props: Props) {
    super(props);
  };

  static layerName = 'DepotsTextLayer';
  static defaultProps = {
    id: 'DepotsTextLayer',
    iconChange: true,
    layerRadiusScale: 1,
    layerOpacity: 0.5,
    optionVisible: true,
    optionChange: false,
    optionOpacity: 0.25,
    optionCellSize: 20,
    optionElevationScale: 1,
    optionCentering: false,
    optionDisplayPosition: 30,
    pickable: true,
    getColor: (x: DepotsTextData) => x.color || COLOR4,
    getRadius: (x: DepotsTextData) => x.radius || 30,
    getCubeColor: (x: DepotsTextData) => x.optColor || [x.color] || [COLOR4],
    getCubeElevation: (x: DepotsTextData) => x.optElevation,
    mesh: defaultmesh,
    meshSizeScale: 40,
    getOrientation: [0,0,0],
    getScale: [0.1,0.1,0.1],
    getTranslation: [0,0,0],
  };

  getIconLayer():any[] {
    const { id, iconlayer, iconChange, layerRadiusScale, layerOpacity,
      depotsTextData, getColor, getRadius, pickable, visible,
      mesh, meshSizeScale, getOrientation, getScale, getTranslation,
      iconDesignations:propIconDesignations
    } = this.props;

    if(!visible) return null;

    const selectlayer = iconlayer||(iconChange ? 'SimpleMesh':'Scatterplot');
    const defaultIconDesignations = [{'type':undefined,'layer':selectlayer}];
    const iconDesignations = propIconDesignations || defaultIconDesignations;

    return iconDesignations.map((iconDesignation:IconDesignation, idx:Number)=>{
      const {type, layer,
        radiusScale:overradiusScale, getColor:overgetColor, getOrientation:overgetOrientation,
        getScale:overgetScale, getTranslation:overgetTranslation, getRadius:overgetRadius,
        sizeScale:oversizeScale, mesh:overmesh} = iconDesignation;
      const getPosition = (x: DepotsTextData) => !type || !x.type || (x.type && x.type === type) ? x.position : null;
      if(layer && layer === 'Scatterplot'){
        return [
          new ScatterplotLayer({
            id: id + '-depots-Scatterplot-' + String(idx),
            data: depotsTextData,
            radiusScale: overradiusScale || layerRadiusScale,
            getPosition,
            getFillColor: overgetColor || getColor,
            getRadius: overgetRadius || getRadius,
            opacity: layerOpacity,
            pickable,
            radiusMinPixels: 1
          })];
      }else
      if(layer && layer === 'SimpleMesh'){
        return [
          new SimpleMeshLayer({
            id: id + '-depots-SimpleMesh-' + String(idx),
            data: depotsTextData,
            mesh: overmesh || mesh,
            sizeScale: oversizeScale || meshSizeScale,
            getPosition,
            getColor: overgetColor || getColor,
            getOrientation: overgetOrientation || getOrientation,
            getScale: overgetScale || getScale,
            getTranslation: overgetTranslation || getTranslation,
            opacity: layerOpacity,
            pickable,
          })];
      }else{
        console.log('iconDesignations layer undefined.');
        return null;
      }
    });
  }

  getTextLayer():any[] {
    const { id, depotsTextData, visible } = this.props;

    if(!visible) return null;

    const getPosition = (x: DepotsTextData) => [x.position[0], x.position[1], x.position[2] + 4];
    const getText = (x: DepotsTextData) => x.text || "no-text";

    const characterSet = Array.from(new Set([].concat(...(depotsTextData.map(depot => depot.text.split(''))))));
    // console.log(characterSet);

    const layer = new TextLayer({
      id: id + '-text-layer',
      data: depotsTextData,
      pickable: true,
      getPosition,
      getText,
      getSize: 18,
      getColor: [255,255,255,255],
      getAngle: 0,
      getTextAnchor: 'start',
      getAlignmentBaseline: 'center',
      characterSet,
      fontSettings: {
        fontSize: 32,
      },
      fontFamily: '"Meiryo UI", Monaco, monospace, sans-serif',
    });

    return [layer];
  }

  renderLayers():any[] {
    const { id, depotsTextData,
      getRadius, optionElevationScale, optionVisible, optionChange, pickable,
      optionOpacity, optionCellSize, getCubeColor, getCubeElevation,
      optionCentering, iconChange, optionDisplayPosition
    } = this.props;

    if (!depotsTextData || depotsTextData.length === 0) {
      return null;
    }

    const stacking2 = optionVisible && optionChange;
    const optPlacement = optionVisible && iconChange ? ()=>optionDisplayPosition : getRadius;
    const iconLayers = this.getIconLayer();
    const textLayers = this.getTextLayer();
    // console.log(iconLayers);

    return [
      textLayers,
      iconLayers,
      optionVisible ?
      new CubeGraphLayer({
        id: id + '-depots-opt-cube',
        optionData: depotsTextData,
        visible: optionVisible,
        optionCentering,
        stacking2,
        getRadius:optPlacement,
        getCubeColor,
        getCubeElevation,
        opacity: optionOpacity,
        pickable,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
      }) : null,
    ];
  }
}
