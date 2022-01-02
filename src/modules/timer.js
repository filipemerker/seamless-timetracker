import Immutable, { merge } from 'seamless-immutable'

export const UPDATE_COUNTER = 'timer/UPDATE_COUNTER'
export const UPDATE_MODE = 'timer/UPDATE_MODE'
export const UPDATE_CONFIG = 'timer/UPDATE_CONFIG'

// Only milliseconds here

const initialState = Immutable({
  counter: 2700000,
  mode: 'pomodoro',
  config: {
    pomodoro: {
      duration: 2700000,
      label: 'Pomodoro'
    },
    short: {
      duration: 300000,
      label: 'Short break'
    },
    long: {
      duration: 900000,
      label: 'Long break'
    }
  }
})

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COUNTER:
      return merge(state, {
        counter: action.counter
      })

    case UPDATE_MODE:
      return merge(state, {
        mode: action.mode
      })

    case UPDATE_CONFIG:
      return merge(state, {
        config: action.config
      })

    default:
      return state
  }
}

export const decrement = () => (dispatch, getState) => {
  const { counter } = getState().timer

  dispatch({
    type: UPDATE_COUNTER,
    counter: counter - 1000
  })
}

export const setMode = mode => (dispatch, getState) => {
  const { config } = getState().timer
  const clock = config[mode].duration

  dispatch({
    type: UPDATE_MODE,
    mode
  })
  dispatch({
    type: UPDATE_COUNTER,
    counter: clock
  })
}
