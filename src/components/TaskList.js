import React, { Component } from 'react'
import styled from 'styled-components'

import TaskItem from './TaskItem'

class TaskList extends Component {
  render() {
    const { data, title, active } = this.props

    return (
      <Main>
        <SectionTitle>{title}</SectionTitle>
        <List active={active}>
          {data.map(item => (
            <TaskItem key={item.id} {...this.props} item={item} />
          ))}
        </List>
      </Main>
    )
  }
}

const Main = styled.section`
  width: 100%;
`

const SectionTitle = styled.h3`
  margin-bottom: 5px;
  color: #777b92;
`

const List = styled.ul`
  margin-bottom: 40px;
  border-radius: 2px;
  box-shadow: 0px 3px 29px -9px rgba(0, 0, 0, 0.13);
  position: relative;

  ${props => !props.active && 'opacity: .5;'};
`

export default TaskList
