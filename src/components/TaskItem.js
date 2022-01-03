import React, { memo } from 'react'
import styled from 'styled-components'
import get from 'lodash.get'
import { timeFormatter, getToday } from 'utils'

const TaskItem = ({
  filter,
  current,
  actions,
  isRunning,
  setFilterTag,
  item
}) => {
  const { id, title, spent, estimate, tags } = item

  const today = getToday()
  const dailyTime = get(spent, `daily[${today}].time`)
  const dailyPomodoros = get(spent, `daily[${today}].pomodoros`)

  return (
    <ListItem>
      <Title>{title}</Title>
      <Misc>
        <MiscEntry>
          <strong>Time spent: </strong>
          {timeFormatter(spent.total.time) || '0m'}
        </MiscEntry>
        {!!estimate && (
          <MiscEntry>
            <strong>Planned: </strong>
            {timeFormatter(estimate)}
          </MiscEntry>
        )}
        {!!dailyTime && (
          <MiscEntry>
            <strong>Today: </strong>
            {timeFormatter(spent.daily[today].time) || '0m'}
          </MiscEntry>
        )}
        {!!dailyPomodoros && (
          <MiscEntry>
            <strong>Pomodoros Today: </strong>
            {spent.daily[today].pomodoros}
          </MiscEntry>
        )}
        {id === current && isRunning && <Running />}
      </Misc>
      {Boolean(tags.length) && (
        <Tags>
          {tags.map(tag => (
            <Tag
              active={filter.tags.some(t => t === tag)}
              onClick={() => setFilterTag(tag)}
              key={`tag-${tag}-${id}`}
            >
              {tag}
            </Tag>
          ))}
        </Tags>
      )}
      <Actions className="actions">
        {actions &&
          actions.map(({ icon, onClick, isActive = () => true }) => (
            <Action
              key={id + icon}
              className={icon}
              isActive={isActive(id)}
              onClick={() => onClick(id)}
            >
              <i className={`fa fa-${icon}`} />
            </Action>
          ))}
      </Actions>
    </ListItem>
  )
}

const Tag = styled.h4`
  color: #aab3c3;
  border: #bdc8dc solid 1px;
  display: inline-block;
  font-size: 12px;
  font-weight: 100;
  border-radius: 3px;
  padding: 1px 5px 1px 5px;
  margin: 0px 3px 0px 0px;
  box-sizing: border-box;
  transition: 0.1s all linear;
  cursor: pointer;

  &:hover {
    background-color: #bdc8dc;
    color: white;
  }

  ${props =>
    props.active &&
    `
    background-color: #bdc8dc;
    color: white;
  `};
`

const Tags = styled.section`
  display: inline-block;
  margin: 20px 0px 0px;
  width: 100%;
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

  @media (max-width: 1000px) {
    .actions {
      opacity: 1;
    }
  }
`

const Title = styled.h3`
  font-size: 16px;
  margin: 0;
  margin-bottom: 12px;
  width: 100%;
  font-weight: 300;
`

const Misc = styled.div`
  width: 100%;
  margin-top: 0px;
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

export default memo(TaskItem)
