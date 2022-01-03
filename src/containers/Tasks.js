import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { updateCurrent, removeTask, closeTask, reopenTask } from 'modules/tasks'
import { setMode } from 'modules/timer'
import { createTag } from 'modules/tasks'

import NewTask from 'components/NewTask'
import TaskList from 'components/TaskList'

class Tasks extends Component {
  state = {
    filter: {
      tags: []
    },
    loading: false
  }

  componentDidMount = async () => {
    this.setState({ loading: true })

    this.normalizeTags(this.props.tasks)

    this.setState({ loading: false })
  }

  onDelete = id => {
    const { removeTask } = this.props
    const confirmationMessage =
      "Are you sure you want to delete this task? This action can't be undone."
    const r = window.confirm(confirmationMessage)

    if (r === true) {
      removeTask(id)
    }
  }

  onClose = id => {
    const { closeTask } = this.props
    const confirmationMessage =
      'Is this task done? \nCongratulations! What a productive day 🎉'
    const r = window.confirm(confirmationMessage)

    if (r === true) {
      closeTask(id)
    }
  }

  onReopen = id => {
    const { reopenTask } = this.props
    const confirmationMessage = 'Do you really want to reopen this task?'
    const r = window.confirm(confirmationMessage)

    if (r === true) {
      reopenTask(id)
    }
  }

  onPlay = id => {
    const { timerActions, timerState, updateCurrent } = this.props

    updateCurrent(id)

    if (!timerState.running) {
      timerActions.play()
    }
  }

  onStop = () => {
    const { timerActions } = this.props

    timerActions.stop()
  }

  isRunning = id => {
    const { timerState, current } = this.props

    return timerState.running && current === id
  }

  setFilterTag = tag => {
    const { filter } = this.state

    if (filter.tags.some(t => t === tag)) {
      this.setState({
        filter: {
          ...filter,
          ...{ tags: filter.tags.filter(t => t !== tag) }
        }
      })
    } else {
      this.setState({
        filter: {
          ...filter,
          ...{ tags: filter.tags.concat(tag) }
        }
      })
    }
  }

  filter = data => {
    const { filter } = this.state

    return data.filter(({ tags = [] }) =>
      filter.tags.every(filterTag => tags.some(tag => tag === filterTag))
    )
  }

  normalizeTags = tasks => {
    const { tags, createTag } = this.props
    const absent = tasks.reduce((acc, current) => {
      const absent = current.tags.filter(
        tag => !tags.includes(tag) && !acc.includes(tag)
      )

      return acc.concat(absent)
    }, [])

    absent.forEach(tag => createTag(tag))
  }

  render = () => {
    const { timerState, tasks, current } = this.props
    const { filter, loading } = this.state

    return (
      <TaskBox>
        <section>
          <SectionTitle>New Task</SectionTitle>
          <NewTask />
        </section>
        <TaskSection>
          <TaskList
            active
            title="To do"
            data={this.filter(tasks)}
            current={current}
            filter={filter}
            setFilterTag={this.setFilterTag}
            isRunning={timerState.running}
            loading={loading}
            actions={[
              {
                icon: 'check',
                onClick: this.onClose
              },
              {
                icon: 'times',
                onClick: this.onDelete
              },
              {
                icon: 'play',
                isActive: id => !this.isRunning(id),
                onClick: this.onPlay
              },
              {
                icon: 'stop',
                isActive: id => this.isRunning(id),
                onClick: this.onStop
              }
            ]}
          />
        </TaskSection>
      </TaskBox>
    )
  }
}

const SectionTitle = styled.h3`
  margin-bottom: 5px;
  color: #777b92;
`

const TaskSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`

const TaskBox = styled.section`
  width: 85%;
  margin-right: 5%;
  margin: 0 auto;
  padding: 20px 0px;
  color: #353849;
  position: relative;
`

const mapStateToProps = state => ({
  tasks: state.tasks.open,
  tags: state.tasks.tags,
  current: state.tasks.current,
  mode: state.timer.mode
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCurrent,
      removeTask,
      reopenTask,
      closeTask,
      createTag,
      setMode
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Tasks)
