import React, { Component } from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { setExpand } from 'modules/app'
import { decrement, setMode } from 'modules/timer'
import { incrementTaskTime, incrementTaskPomodoro } from 'modules/tasks'
import { store } from 'store'

import Timer from './Timer'
import Tasks from './Tasks'
import worker from '../worker'

import { getTimer } from 'utils'

const ring = require('assets/ring.mp3')

class App extends Component {
  constructor() {
    super()

    this.audio = new Audio()
    this.audio.src = ring
  }

  state = {
    finished: false,
    running: false,
    options: true,
    streak: [],
    title: 'React Timesaver - Time tracking for productivity',

    possibleActions: ['stop', 'play', 'check'],
    currentAction: 'play'
  }

  intervalWorker = null

  play = () => {
    const { decrement, mode, incrementTaskTime } = this.props

    this.setState({
      currentAction: 'stop',
      running: true,
      options: false,
      streak: this.state.streak.concat(mode)
    })

    this.intervalWorker = new Worker(worker)

    this.intervalWorker.onmessage = () => {
      const { counter } = store.getState().timer

      if (counter <= 0) {
        this.finishCounter()
        this.audio.play()

        return false
      }

      document.title = `${getTimer(counter)} | ${this.state.title}`
      incrementTaskTime()
      decrement()
    }
  }

  finishCounter = () => {
    const { mode, incrementTaskPomodoro } = this.props
    document.title = this.state.title

    if (mode === 'pomodoro') {
      incrementTaskPomodoro()
    }
    if (this.intervalWorker) {
      this.intervalWorker.terminate()
    }

    this.setState({
      currentAction: 'check',
      running: false,
      options: false,
      finished: true
    })
  }

  stop = () => {
    const { setMode, mode } = this.props

    this.setState({
      currentAction: 'play',
      running: false,
      options: true
    })

    if (this.intervalWorker) {
      this.intervalWorker.terminate()
    }

    document.title = this.state.title
    setMode(mode)
  }

  check = () => {
    const { setMode } = this.props

    this.setState({
      currentAction: 'play',
      running: false,
      options: true,
      finished: false
    })

    setMode(this.getNextMode())
  }

  getNextMode = () => {
    const { mode } = this.props

    if (mode === 'pomodoro') {
      return 'short'
    } else {
      return 'pomodoro'
    }
  }

  render = () => {
    const timerState = this.state
    const { expand, setExpand } = this.props

    const timerActions = {
      play: this.play,
      stop: this.stop,
      check: this.check
    }
    return (
      <Main className="App">
        <TimerContainer expand={expand}>
          <button onClick={() => setExpand(expand ? null : 'timer')}>
            {expand}
          </button>
          <Timer timerActions={timerActions} timerState={timerState} />
        </TimerContainer>
        <TasksContainer expand={expand}>
          <Tasks timerActions={timerActions} timerState={timerState} />
        </TasksContainer>
      </Main>
    )
  }
}

const Main = styled.main`
  height: 100vh;
  width: 100vw;

  @media (max-width: 1000px) {
    width: 100%;
    height: auto;
  }
`

const TimerContainer = styled.section`
  width: 35%;
  height: 100vh;
  float: left;
  background: linear-gradient(to bottom right, #c9d4e8, #e6bab8);

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  transition: 0.85s all ease-in-out;
  position: absolute;
  z-index: 2;
  left: 0px;
  top: 0px;

  ${props => props.expand === 'timer' && 'width: 100%; height: 100vh;'};

  @media (max-width: 1000px) {
    ${props => props.expand !== 'timer' && 'height: auto;'};
    width: 100%;
    position: relative;
  }
`

const TasksContainer = styled.section`
  width: 65%;
  height: 100vh;
  float: left;
  opacity: 1;
  overflow-y: scroll;

  transition: 0.5s all ease-in-out;
  position: absolute;
  z-index: 1;
  right: 0px;
  top: 0px;

  ${props => props.expand === 'timer' && 'opacity: 0;'};

  @media (max-width: 1000px) {
    ${props => props.expand === 'timer' && 'height: 0px;'};
    ${props => props.expand !== 'timer' && 'height: auto;'};
    overflow-y: auto;
    width: 100%;
    position: relative;
    z-index: 10;
  }
`

const mapStateToProps = state => ({
  counter: state.timer.counter,
  current: state.tasks.current,
  expand: state.app.expand,
  mode: state.timer.mode
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      incrementTaskPomodoro,
      incrementTaskTime,
      setExpand,
      decrement,
      setMode
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(App)
