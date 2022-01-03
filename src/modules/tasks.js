import Immutable, { merge } from 'seamless-immutable'
import { getToday, id } from 'utils'

export const UPDATE_OPEN_TASKS = 'tasks/UPDATE_OPEN_TASKS'
export const UPDATE_TAGS = 'tasks/UPDATE_TAGS'
export const UPDATE_CLOSED_TASKS = 'tasks/UPDATE_CLOSED_TASKS'
export const UPDATE_CURRENT = 'tasks/UPDATE_CURRENT'

// Only milliseconds here

const initialState = Immutable({
  open: [],
  closed: [],
  tags: [],
  current: null
})

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TAGS:
      return merge(
        state,
        {
          tags: action.tags
        },
        { deep: true }
      )

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

export const resetTasks = () => (dispatch, getState) => {
  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks: []
  })
  dispatch({
    type: UPDATE_CLOSED_TASKS,
    tasks: []
  })
  dispatch({
    type: UPDATE_CURRENT,
    current: null
  })
}

export const createTask = task => (dispatch, getState) => {
  try {
    const { open } = getState().tasks
    const formattedTask = {
      id: id(),
      created_at: Date.now(),
      title: task.title,
      estimate: task.estimate,
      tags: task.tags,
      status: 'open',
      spent: {
        total: {
          time: 0,
          pomodoros: 0
        },
        daily: {}
      }
    }

    dispatch({
      type: UPDATE_OPEN_TASKS,
      tasks: [formattedTask].concat(open)
    })
  } catch (err) {}
}

export const createTag = tag => async (dispatch, getState) => {
  try {
    const { tags } = getState().tasks

    dispatch({
      type: UPDATE_TAGS,
      tags: tags.concat(tag)
    })
  } catch (err) {}
}

export const removeTag = tag => async (dispatch, getState) => {
  try {
    const { tags } = getState().tasks

    dispatch({
      type: UPDATE_TAGS,
      tags: tags.filter(t => t !== tag)
    })
  } catch (err) {}
}

export const removeTask = id => (dispatch, getState) => {
  try {
    const { open } = getState().tasks
    const openTasks = open.filter(task => task.id !== id)

    dispatch({
      type: UPDATE_OPEN_TASKS,
      tasks: openTasks
    })
  } catch (err) {}
}

export const closeTask = id => (dispatch, getState) => {
  try {
    //const data = { status: 'closed', closed_at: getToday() }

    const { open } = getState().tasks
    const openTasks = open.filter(task => task.id !== id)

    dispatch({
      type: UPDATE_OPEN_TASKS,
      tasks: openTasks
    })
  } catch (err) {}
}

export const reopenTask = id => (dispatch, getState) => {
  try {
    const data = { status: 'open' }

    const { open, closed } = getState().tasks
    const task = {
      ...closed.find(task => task.id === id),
      ...data
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
  } catch (err) {}
}

export const updateCurrent = id => dispatch => {
  dispatch({
    type: UPDATE_CURRENT,
    current: id
  })
}

export const incrementTaskPomodoro = () => (dispatch, getState) => {
  const { open, current } = getState().tasks
  const today = getToday()

  const tasks = open.map(task => {
    const spent = { total: {}, daily: {} }

    if (task.id === current) {
      const { total, daily } = task.spent
      const todayEntry = daily[today] || { time: 0, pomodoros: 0 }

      spent.total = { ...total, ...{ pomodoros: total.pomodoros + 1 } }
      spent.daily[today] = {
        ...todayEntry,
        ...{ pomodoros: todayEntry.pomodoros + 1 }
      }
    }
    return { ...task, ...{ spent } }
  })

  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks
  })
}

export const incrementTaskTime = () => (dispatch, getState) => {
  const { open, current } = getState().tasks
  const today = getToday()

  const tasks = open.map(task => {
    const spent = { total: {}, daily: {} }

    if (task.id === current) {
      const { total, daily } = task.spent
      const todayEntry = daily[today] || { time: 0, pomodoros: 0 }

      spent.total = { ...total, ...{ time: total.time + 1000 } }
      spent.daily[today] = {
        ...todayEntry,
        ...{ time: todayEntry.time + 1000 }
      }
    }
    return { ...task, ...{ spent } }
  })

  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks
  })
}
