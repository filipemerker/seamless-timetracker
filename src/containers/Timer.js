import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import CircularProgressbar from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { decrement, setMode, setConfig } from 'modules/timer'
import { getTimer } from 'utils'

class Timer extends Component {
  state = {
    configModal: false,
    config: { ...this.props.config }
  }

  action = () => {
    const { currentAction } = this.props.timerState
    const { timerActions } = this.props

    timerActions[currentAction]()
  }

  getPercentage = () => {
    const { counter, mode, config } = this.props

    return 100 - (counter / config[mode].duration) * 100
  }

  getGreeting = (mode, finished, config) => {
    if (!finished) {
      return (
        <div>
          <strong>Timer mode: </strong> {config[mode].label}
        </div>
      )
    } else {
      return {
        pomodoro: (
          <div>
            <strong>Congratulations!</strong>{' '}
            <Motivation>You worked a lot, get some rest!</Motivation>
          </div>
        ),
        short: (
          <div>
            <strong>Well done!</strong>{' '}
            <Motivation>
              You got some rest, now let's get back to work.
            </Motivation>
          </div>
        ),
        long: (
          <div>
            <strong>Well done!</strong>{' '}
            <Motivation>Are you ready for the hard work?</Motivation>
          </div>
        )
      }[mode]
    }
  }

  updateConfig = ({ target }) => {
    const { name, value } = target
    const { config } = this.state
    const updated = {
      duration: Number(value) * 60000,
      label: config[name].label
    }

    if (value >= 0 && value <= 60) {
      this.setState({
        config: {
          ...config,
          ...{ [name]: updated }
        }
      })
    }
  }

  saveConfig = (e, mode) => {
    this.setState({ configModal: false })
    this.props.setConfig(this.state.config)
  }

  render = () => {
    const { finished, currentAction, options } = this.props.timerState
    const { configModal } = this.state
    const {
      currentTask,
      openTasks,
      setMode,
      counter,
      config,
      mode: activeMode
    } = this.props

    const modes = Object.keys(config)
    const current = openTasks.find(task => task.id === currentTask)

    return (
      <TimerBox optionsVisible={options}>
        <TimerHeader>
          <Label className="fixed-height" active>
            {this.getGreeting(activeMode, finished, config)}
          </Label>
          <Config onClick={() => this.setState({ configModal: true })}>
            <i className="fa fa-cog" />
          </Config>
        </TimerHeader>
        <Monitor>
          {finished && (
            <Sonar>
              <Pulse />
              <Shield />
            </Sonar>
          )}
          <CircularProgressbar
            percentage={this.getPercentage()}
            styles={{
              path: {
                stroke: finished ? 'rgb(96, 194, 141)' : 'rgb(215, 107, 107)',
                strokeWidth: 3
              },
              trail: {
                stroke: 'rgb(216, 198, 206)',
                strokeWidth: 1.5
              }
            }}
          />
          <Clock>{getTimer(counter, { extraSpace: true })}</Clock>
        </Monitor>

        {current && (
          <Label className="margin-below" active={activeMode === 'pomodoro'}>
            <strong>Your taks is </strong> {current.title}
          </Label>
        )}

        <Options visible={options}>
          {modes.map((mode, i) => (
            <Option
              key={`option${i}`}
              active={activeMode === mode}
              onClick={() => setMode(mode)}
            >
              {config[mode].label}
            </Option>
          ))}
        </Options>

        {configModal && (
          <ConfigModal>
            <TimerHeader>
              <Label className="fixed-height" active>
                <strong>Settings</strong>
              </Label>
              <Config
                onClick={() => this.setState({ configModal: false, config })}
              >
                <i className="fa fa-close" />
              </Config>
            </TimerHeader>
            {modes.map((mode, i) => (
              <ConfigItem key={`option${i}`}>
                <label>{config[mode].label}</label>
                <Input
                  onChange={e => this.updateConfig(e, mode)}
                  value={this.state.config[mode].duration / 60000}
                  name={mode}
                  type="number"
                />
              </ConfigItem>
            ))}
            <Save onClick={() => this.saveConfig()}>SAVE</Save>
            <Disclaimer>
              All values are in <strong>minutes</strong>
            </Disclaimer>
          </ConfigModal>
        )}

        <Toggle onClick={this.action} finished={finished}>
          <i className={`fa fa-${currentAction}`} />
        </Toggle>
      </TimerBox>
    )
  }
}

const ConfigModal = styled.section`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 7px;
  padding-top: 20px;
  box-sizing: border-box;
  background-color: #f2f3f6;
  flex-direction: column;
`

const ConfigItem = styled.div`
  justify-content: space-between;
  display: flex;
  margin: 10px 30px;

  label {
    color: #8e90a2;
    font-weight: 100;
  }
  input {
    width: 40px;
    border-radius: 3px;
  }
`

const Save = styled.div`
  background: #d76b6b;
  display: inline-block;
  margin: 30px 25px 10px 28px;
  line-height: 36px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-weight: 100;
`

const Disclaimer = styled.p`
  line-height: 11px;
  font-size: 11px;
  font-weight: 100;
  text-align: center;
  margin-top: -1px;
  color: #8e90a2;
`

const Input = styled.input`
  display: inline-block;
  border: none;
  background: #fff;
  font-weight: 100;
  font-size: 15px;
  box-sizing: border-box;
  margin-top: 0px;
  color: #74768a;
`

const Motivation = styled.p`
  display: initial;

  @media (max-width: 700px) {
    display: none;
  }
`

const TimerBox = styled.section`
  width: 310px;
  border-radius: 8px;
  position: relative;
  display: inline-block;

  text-align: center;
  color: #353849;

  background-color: #f2f3f6;
  box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.13), 8px 8px 40px rgba(0, 0, 0, 0.12);
  transition: all 0.32s cubic-bezier(0.42, 0, 0.36, 0.99);

  padding-top: 20px;
  padding-bottom: ${props => (props.optionsVisible ? '45px' : '10px')};

  @media (max-width: 1000px) {
    width: 280px;
    margin: 95px 0px 70px;
  }
`

const Monitor = styled.header`
  margin-top: 0px;
  margin-bottom: 15px;
  display: inline-block;
  width: 250px;
  position: relative;
  box-sizing: border-box;
  padding: 5px 5px;

  svg {
    position: relative;
  }

  @media (max-width: 700px) {
    margin-top: -5px;
    margin-bottom: 5px;
    width: 200px;
  }
`

const Sonar = styled.div`
  position: absolute;
  width: calc(100% - 38px);
  height: calc(100% - 41px);
  left: 50%;
  top: 50%;
  margin-top: -3px;
  transform: translate(-50%, -50%);

  @media (max-width: 700px) {
    width: calc(100% - 32px);
    height: calc(100% - 32px);
  }
`

const Pulse = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  border-radius: 100%;
  animation: pulse 2s ease infinite;
  background: rgb(96, 194, 141);

  @keyframes pulse {
    0% {
      transform: scale(1, 1);
    }
    50% {
      opacity: 0.3;
    }
    95% {
      opacity: 0;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`

const Shield = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background: #f2f3f6;
`

const Clock = styled.div`
  font-size: 35px;
  font-weight: 700;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 700px) {
    font-size: 30px;
  }
`

const TimerHeader = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  box-sizing: border-box;
`

const Config = styled.div`
  font-size: 18px;
  color: #8e90a2;
  padding-top: 3px;
  padding-right: 7px;
  cursor: pointer;
`

const Label = styled.div`
  text-align: center;
  box-sizing: border-box;
  padding: 5px 10px;
  margin: 0 0;
  font-size: 14px;
  color: #8e90a2;
  font-weight: 100;
  margin-bottom: 9px;
  transition: all 0.2s linear;
  opacity: 1;
  border-radius: 3px;

  opacity: ${({ active }) => (active ? 1 : 0.3)};

  &.margin-below {
    margin-bottom: 20px;
  }
  &.fixed-height {
    height: 38px;
  }
`

const Options = styled.ul`
  height: 26px;
  padding: 0px 0px 0px;
  margin: 0px 30px 10px;
  display: flex;
  justify-content: space-between;
  transition: all 0.2s linear;
  position: relative;

  opacity: ${({ visible }) => (visible ? '1' : '0')};

  ${props =>
    !props.visible &&
    `
    &::after {
      content: "";
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;
    }
  `};
`

const Option = styled.li`
  display: inline-block;
  padding: 5px 0px;
  width: 31%;
  text-align: center;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 300;
  margin: 0px 0px;
  cursor: pointer;
  transition: all 0.14s linear;

  background-color: ${props => (props.active ? '#d76b6b' : 'transparent')};
  color: ${props => (props.active ? '#ffffff' : '#8a8c94')};
  box-shadow: ${props =>
    !props.active && 'inset 0px 0px 0px 1px rgba(0,0,0,0.13)'};
`

const Toggle = styled.button`
  outline: none;
  border: none;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, 50%);
  overflow: hidden;
  cursor: pointer;

  ${({ finished }) =>
    finished
      ? `
        background: linear-gradient(to bottom, #83e2b7, #55ab6d);
        box-shadow: 0px 19px 20px -10px rgba(85, 171, 79, 0.38);
      `
      : `
        background: linear-gradient(to bottom, #ea8379, #cf3845);
        box-shadow: 0px 19px 20px -10px rgba(207, 56, 69, 0.38);
      `} font-size: 20px;
  color: white;

  .fa {
    position: relative;
    z-index: 1;
  }

  .fa-play {
    left: 3px;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;

    top: 13%;
    left: 0px;
    z-index: 0;

    ${({ finished }) =>
      finished
        ? `background: linear-gradient(to bottom, #65cd9e, #55ab6d);`
        : `background: linear-gradient(to bottom, #eb6267, #cf3845);`};
  }
`

const mapStateToProps = state => ({
  counter: state.timer.counter,
  mode: state.timer.mode,
  config: state.timer.config,

  openTasks: state.tasks.open,
  currentTask: state.tasks.current
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      decrement,
      setConfig,
      setMode
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
