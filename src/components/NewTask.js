import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Tags from 'components/Tags'
import { createTask } from 'modules/tasks'
import { timeParser } from 'utils'

class NewTask extends Component {
  state = {
    title: '',
    estimate: '',
    tags: []
  }

  hasValue = () => this.state.title.trim().length

  onSubmit = e => {
    e.preventDefault()

    if (this.hasValue()) {
      this.addTask()
    }
  }

  addTask = () => {
    const { title, estimate, tags } = this.state
    const { createTask } = this.props

    createTask({
      title,
      tags,
      estimate: timeParser(estimate)
    })

    this.setState({
      title: '',
      estimate: '',
      tags: []
    })
  }

  handleChange = e => {
    const { name, value } = e.target

    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <NewItemForm onSubmit={this.onSubmit}>
        <InputContainer width={{ desktop: '65%', mobile: '100%' }}>
          <TagsHolder>
            <Tags
              setValue={tags => this.setState({ tags })}
              selectedTags={this.state.tags}
            />
          </TagsHolder>

          <InputTitle>What will you be working on?</InputTitle>
          <Input
            type="text"
            name="title"
            onChange={this.handleChange}
            value={this.state.title}
            placeholder="Ex: Fix the profile page layout proportions"
          />
        </InputContainer>
        <InputContainer width={{ desktop: '27.5%', mobile: '80%' }}>
          <InputTitle>What's your time estimate?</InputTitle>
          <Input
            name="estimate"
            type="text"
            onChange={this.handleChange}
            value={this.state.estimate}
            placeholder="2h 20m"
          />
        </InputContainer>
        <InputContainer width={{ desktop: '7.5%', mobile: '20%' }}>
          <Submit
            active={this.hasValue()}
            type="submit"
            value="ADD"
            placeholder="2h 20m"
          />
        </InputContainer>
      </NewItemForm>
    )
  }
}

const TagsHolder = styled.div`
  position: absolute;
  right: 0px;
  top: -27px;
`

const NewItemForm = styled.form`
  width: 100%;
  display: inline-block;
  margin-bottom: 20px;
  box-shadow: 0px 3px 23px -5px rgba(201, 212, 232, 0.6);
`

const InputContainer = styled.div`
  float: left;
  position: relative;

  width: ${props => props.width.desktop};

  &:first-child > input {
    box-shadow: inset 0 -1px 0 0 #e8e8e8;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  @media (max-width: 700px) {
    width: ${props => props.width.mobile};

    &:first-child > input {
      box-shadow: inset 0px 0px 0 1px #e8e8e8;
      border-radius: 0px;
    }
  }
`

const InputTitle = styled.h2`
  width: 100%;
  display: inline-block;
  font-weight: 400;
  font-size: 11px;
  padding: 0px;
  position: absolute;
  top: -3px;
  left: 8px;
  color: #a1a3ab;
`

const Input = styled.input`
  width: 100%;
  display: inline-block;
  background-color: transparent;
  border: none;
  background: #fff;
  font-weight: 100;
  font-size: 15px;
  padding: 25px 8px 11px 8px;
  box-sizing: border-box;
  margin-top: 0px;
  color: #74768a;
  box-shadow: inset 1px -1px 0 0 #e8e8e8;

  &::placeholder {
    color: #c8c9d0;
    font-weight: 100;
  }
`

const Submit = styled.input`
  background: #e6bab8;
  background: -webkit-linear-gradient(to bottom right, #c9d4e8, #e6bab8);
  background: linear-gradient(to bottom right, #c9d4e8, #e6bab8);
  display: inline-block;
  width: 100%;
  height: 54px;
  border: none;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  color: white;
  font-size: 13px;
  font-weight: 100;
  cursor: pointer;
  transition: all linear 0.2s;

  ${props =>
    !props.active &&
    `
    opacity: .6;
    cursor: default;
  `};

  @media (max-width: 700px) {
    border-radius: 0px;
  }
`

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createTask
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(NewTask)
