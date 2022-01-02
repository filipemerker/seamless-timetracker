import React, { Component } from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { decrement, setMode } from 'modules/timer'
import { incrementTaskTime } from 'modules/tasks'
import { store } from 'store'

import Timer from './Timer'
import Tasks from './Tasks'
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
    title: 'React Pomodoro',

    possibleActions: ['stop', 'play', 'check'],
    currentAction: 'play'
  }

  interval = null

  play = () => {
    const { decrement, mode, incrementTaskTime } = this.props

    this.setState({
      currentAction: 'stop',
      running: true,
      options: false,
      streak: this.state.streak.concat(mode)
    })

    this.interval = setInterval(() => {
      const { counter } = store.getState().timer

      if (counter <= 0) {
        this.finishCounter()
        this.audio.play()

        return false
      }

      document.title = `${getTimer(counter)} | ${this.state.title}`
      incrementTaskTime()
      decrement()
    }, 1000)
  }

  finishCounter = () => {
    document.title = this.state.title
    clearInterval(this.interval)

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

    document.title = this.state.title
    clearInterval(this.interval)
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
    const timerActions = {
      play: this.play,
      stop: this.stop,
      check: this.check
    }
    return (
      <Main className="App">
        <TimerContainer>
          <Timer timerState={timerState} timerActions={timerActions} />
        </TimerContainer>
        <TasksContainer>
          <Tasks timerState={timerState} timerActions={timerActions} />
        </TasksContainer>
      </Main>
    )
  }
}

const Main = styled.main`
  height: 100vh;
  width: 100vw;
`

const TimerContainer = styled.section`
  width: 30%;
  height: 100vh;
  float: left;
  background: linear-gradient(to bottom right, #c9d4e8, #e6bab8);

  display: flex;
  align-items: center;
  justify-content: center;
`

const TasksContainer = styled.section`
  width: 70%;
  height: 100vh;
  float: left;
  overflow-y: auto;
`

const mapStateToProps = state => ({
  counter: state.timer.counter,
  mode: state.timer.mode
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      incrementTaskTime,
      decrement,
      setMode
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(App)
