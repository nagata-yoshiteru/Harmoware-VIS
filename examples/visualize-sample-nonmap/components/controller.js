// @flow

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_play_circle_outline as icPlayArrow, ic_pause_circle_outline as icPause,
  ic_forward as icForward, ic_replay as icReplay,
  ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
import { MovesInput, DepotsInput, LinemapInput,
  AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton,
  ElapsedTimeRange, SpeedRange, SimulationDateTime, NavigationButton } from 'harmoware-vis';
import type { Actions, InputEvent } from 'harmoware-vis';
import i18n from './../locales/I18n';

type ControllerProps = {
  settime: number,
  timeBegin: number,
  timeLength: number,
  secperhour: number,
  animatePause: boolean,
  animateReverse: boolean,
  animatePause: boolean,
  actions: Actions,
  t: Function,
  viewport: Object,
}

export default class Controller extends Component<ControllerProps> {
  onLanguageSelect(e: InputEvent) {
    const value = e.target.value;
    i18n.changeLanguage(value);
  }

  render() {
    const { settime, timeBegin, timeLength, actions,
      secperhour, animatePause, animateReverse, t, viewport } = this.props;

    return (
      <div className="harmovis_controller" id="controller_area">
        <ul className="harmovis_controller__list">
          <li className="harmovis_controller__list__item">
            <select
              className="harmovis_controller__select"
              id="language_select" value={t('langId')}
              onChange={this.onLanguageSelect.bind(this)}
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </li>
          <li className="harmovis_controller__list__item">
            <span>{t('movedData')}</span>
            <MovesInput actions={actions} className="caInput" />
          </li>
          <li className="harmovis_controller__list__item">
            <span className="harmovis_controller__spacer">{t('depotsData')}</span>
            <DepotsInput actions={actions} className="caInput" />
          </li>
          <li className="harmovis_controller__list__item">
            <span>{t('mapData')}</span>
            <LinemapInput actions={actions} className="caInput" />
          </li>
          <li className="harmovis_controller__list__item">
            {animatePause ?
              <PlayButton actions={actions} className="caButton">
                <span><Icon icon={icPlayArrow} />&nbsp;{t('play')}</span></PlayButton> :
              <PauseButton actions={actions} className="caButton">
                <span><Icon icon={icPause} />&nbsp;{t('pause')}</span></PauseButton>
            }
            {animateReverse ?
              <ForwardButton actions={actions} className="caButton">
                <span><Icon icon={icForward} />&nbsp;{t('forward')}</span></ForwardButton> :
              <ReverseButton actions={actions} className="caButton">
                <span><Icon icon={icReplay} />&nbsp;{t('reverse')}</span></ReverseButton>
            }
          </li>
          <li className="harmovis_controller__list__item">
            <AddMinutesButton addMinutes={-10} actions={actions} className="caButton">
              <span><Icon icon={icFastRewind} />&nbsp;-10{t('minute')}</span></AddMinutesButton>
            <AddMinutesButton addMinutes={-5} actions={actions} className="caButton">
              <span><Icon icon={icFastRewind} />&nbsp;-5{t('minute')}</span></AddMinutesButton>
            <AddMinutesButton addMinutes={5} actions={actions} className="caButton">
              <span><Icon icon={icFastForward} />&nbsp;5{t('minute')}</span></AddMinutesButton>
            <AddMinutesButton addMinutes={10} actions={actions} className="caButton">
              <span><Icon icon={icFastForward} />&nbsp;10{t('minute')}</span></AddMinutesButton>
          </li>
          <li className="harmovis_controller__list__item">
            <NavigationButton buttonType="zoom-in" actions={actions} viewport={viewport} className="caButton" />
            <NavigationButton buttonType="zoom-out" actions={actions} viewport={viewport} className="caButton" />
            <NavigationButton buttonType="compass" actions={actions} viewport={viewport} className="caButton" />
          </li>
          <li className="harmovis_controller__list__item">
            <SimulationDateTime timeBegin={timeBegin} settime={settime} locales={t('locales')} className="caSpan" />
          </li>
          <li className="harmovis_controller__list__item"><span>{t('elapsedTime')}</span>
            <ElapsedTimeRange settime={settime} timeLength={timeLength} actions={actions} className="caRange" />
            <span>{Math.floor(settime)}&nbsp;{t('sec')}</span>
          </li>
          <li className="harmovis_controller__list__item"><span>{t('speed')}</span>
            <SpeedRange secperhour={secperhour} actions={actions} className="caRange" />
            <span>{secperhour}&nbsp;{t('sec')}/{t('hour')}</span>
          </li>
        </ul>
      </div>
    );
  }
}
