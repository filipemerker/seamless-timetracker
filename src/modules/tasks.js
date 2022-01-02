import Immutable, { merge } from 'seamless-immutable'
import { id } from 'utils'

export const UPDATE_OPEN_TASKS = 'tasks/CREATE_CLOSED_TASK'
export const UPDATE_CLOSED_TASKS = 'tasks/UPDATE_CLOSED_TASKS'
export const UPDATE_CURRENT = 'tasks/UPDATE_CURRENT'

// Only milliseconds here

const initialState = Immutable({
  open: [],
  closed: [],
  current: null
})

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_OPEN_TASKS:
      return merge(
        state,
        {
          open: action.tasks
        },
        { deep: true }
      )

    case UPDATE_CLOSED_TASKS:
      return merge(
        state,
        {
          closed: action.tasks
        },
        { deep: true }
      )

    case UPDATE_CURRENT:
      return merge(state, {
        current: action.current
      })

    default:
      return state
  }
}

export const createTask = task => (dispatch, getState) => {
  const { open } = getState().tasks
  const formattedTask = {
    id: id(),
    createdAt: Date.now(),
    title: task.title,
    estimate: task.estimate,
    status: 'open',
    spent: {
      total: 0,
      daily: {}
    }
  }

  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks: open.concat(formattedTask)
  })
}

export const removeTask = id => (dispatch, getState) => {
  const { open, closed } = getState().tasks
  const openTasks = open.filter(task => task.id !== id)
  const closedTasks = closed.filter(task => task.id !== id)

  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks: openTasks
  })
  dispatch({
    type: UPDATE_CLOSED_TASKS,
    tasks: closedTasks
  })
}

export const closeTask = id => (dispatch, getState) => {
  const { open, closed } = getState().tasks
  const task = {
    ...open.find(task => task.id === id),
    ...{ status: 'closed' }
  }
  const openTasks = open.filter(task => task.id !== id)
  const closedTasks = closed.concat(task)

  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks: openTasks
  })
  dispatch({
    type: UPDATE_CLOSED_TASKS,
    tasks: closedTasks
  })
}

export const reopenTask = id => (dispatch, getState) => {
  const { open, closed } = getState().tasks
  const task = {
    ...closed.find(task => task.id === id),
    ...{ status: 'open' }
  }
  const openTasks = open.concat(task)
  const closedTasks = closed.filter(task => task.id !== id)

  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks: openTasks
  })
  dispatch({
    type: UPDATE_CLOSED_TASKS,
    tasks: closedTasks
  })
}

export const updateCurrent = id => dispatch => {
  dispatch({
    type: UPDATE_CURRENT,
    current: id
  })
}

export const incrementTaskTime = task => (dispatch, getState) => {
  const { open, current } = getState().tasks
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  const today = date.getTime()

  const tasks = open.map(task => {
    let increment = {}

    if (task.id === current) {
      increment.spent = {}
      increment.spent.daily = {}
      let totalSpent =
        typeof task.spent === 'number' ? task.spent : task.spent.total
      let totalSpentDaily =
        task.spent.daily && task.spent.daily[today]
          ? task.spent.daily[today]
          : 0

      increment.spent.total = totalSpent + 1000
      increment.spent.daily = {
        ...task.spent.daily,
        ...{ [today]: totalSpentDaily + 1000 }
      }
    }

    return { ...task, ...increment }
  })

  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks
  })
}
