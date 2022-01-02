import React, { Component } from 'react'
import styled from 'styled-components'
import { timeFormatter } from 'utils'

class TaskList extends Component {
  render = () => {
    const { data, active, current, title, actions, isRunning } = this.props

    if (!data || !data.length) {
      return null
    }

    return (
      <div>
        <SectionTitle>{title}</SectionTitle>
        <List active={active}>
          {data.map(item => (
            <ListItem key={item.id}>
              <Title>{item.title}</Title>
              <Misc>
                <MiscEntry>
                  <strong>Time spent: </strong>
                  {timeFormatter(item.spent.total) || '0m'}
                </MiscEntry>
                {!!item.estimate && (
                  <MiscEntry>
                    <strong>Time planned: </strong>
                    {timeFormatter(item.estimate)}
                  </MiscEntry>
                )}
                {item.id === current && isRunning && <Running />}
              </Misc>
              <Actions className="actions">
                {actions &&
                  actions.map(({ icon, onClick, isActive = () => true }) => (
                    <Action
                      key={item.id + icon}
                      className={icon}
                      isActive={isActive(item.id)}
                      onClick={() => onClick(item.id)}
                    >
                      <i className={`fa fa-${icon}`} />
                    </Action>
                  ))}
              </Actions>
            </ListItem>
          ))}
        </List>
      </div>
    )
  }
}

const SectionTitle = styled.h3`
  margin-bottom: 5px;
  color: #777b92;
`

const List = styled.ul`
  margin-bottom: 40px;
  border-radius: 2px;
  box-shadow: 0px 3px 29px -9px rgba(0, 0, 0, 0.13);

  ${props => !props.active && 'opacity: .5;'};
`

const ListItem = styled.li`
  width: 100%;
  background-color: #fff;
  padding: 20px 94px 20px 20px;
  box-sizing: border-box;
  margin: 0px 0px 0px 0px;
  position: relative;
  border-radius: 2px;

  color: #676464;
  box-shadow: inset 0 -1px 0 0 #e8e8e8;

  &:hover .actions {
    opacity: 1;
  }
`

const Title = styled.h3`
  font-size: 16px;
  margin: 0;
  width: 100%;
  font-weight: 300;
`

const Misc = styled.div`
  width: 100%;
  margin-top: 11px;
`

const MiscEntry = styled.div`
  font-weight: 300;
  font-size: 12px;
  color: #b5b9c3;
  display: inline-block;
  margin-right: 20px;
`

const Running = styled(MiscEntry)`
  color: rgb(234, 83, 96);
  font-weight: bold;

  &::before {
    content: 'RUNNING';
  }
`

const Actions = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: all linear 0.2s;

  .times {
    font-size: 22px;
    margin-top: -5px;
  }

  .check {
    font-size: 19px;
    margin-top: -2px;
  }

  .history {
    font-size: 19px;
    margin-top: -2px;
  }
`

const Action = styled.div`
  float: left;
  cursor: pointer;
  margin-left: 10px;
  display: none;
  transition: all linear 0.15s;
  color: #c3c5c7;

  ${props => props.isActive && 'display: block;'} &:hover {
    color: #c59b9b;
  }
`

export default TaskList
