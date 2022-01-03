import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import enhanceWithClickOutside from 'react-click-outside'

import { createTag, removeTag } from 'modules/tasks'

class Tags extends Component {
  state = {
    tag: '',
    tags: [],
    opened: false
  }

  hasValue = () => this.state.tag.trim().length > 0

  modalToggle = () => this.setState({ opened: !this.state.opened })
  handleClickOutside = () => this.setState({ opened: false })

  onSubmit = e => {
    if (this.hasValue() && [13, 9].includes(e.keyCode)) {
      e.preventDefault()

      this.addTag()
    }
  }

  addTag = () => {
    const { tag } = this.state
    const { createTag, selectedTags, setValue } = this.props

    this.setState({ tag: '' })

    createTag(tag)
    setValue(selectedTags.concat(tag))
  }

  handleChange = e => {
    const { value: tag } = e.target

    this.setState({ tag })
  }

  onRemoveTag = tag => {
    this.props.removeTag(tag)
    this.toggleTag(true, tag)
  }

  toggleTag = (checked, value, e) => {
    const { setValue, selectedTags } = this.props

    if (e) {
      e.preventDefault()
    }

    if (checked) {
      setValue(selectedTags.filter(tag => tag !== value))
    } else {
      setValue(selectedTags.concat(value))
    }
  }

  render = () => {
    const { tag, opened } = this.state
    const { tags, selectedTags } = this.props
    const filteredTags = tags.filter(storedTag =>
      storedTag.toLowerCase().includes(tag.toLowerCase())
    )
    const noResults =
      (tags.length && !filteredTags.length && this.hasValue()) || false
    const empty = !tags.length

    return (
      <TagsContainer>
        <Toggle
          noTags={!selectedTags.length}
          onClick={() => this.modalToggle()}
        >
          <i className={`fa fa-tag`} /> Tags
          {selectedTags.length > 0 && (
            <TagsTotalizer>{`${selectedTags.length}`}</TagsTotalizer>
          )}
        </Toggle>
        {opened && (
          <NewTagModal>
            <InputContainer>
              <Input
                type="text"
                name={`tag-${Date.now()}`}
                onChange={this.handleChange}
                value={tag}
                autoFocus
                onKeyDown={this.onSubmit}
                placeholder="Add or search your tags."
              />
            </InputContainer>
            <TagList>
              {filteredTags.map((tag, i) => {
                const checked = !!selectedTags.find(
                  selectedTag => tag === selectedTag
                )

                return (
                  <li key={`tag-item-${i}`}>
                    <Checkbox
                      id={`tag-${tag}`}
                      type="checkbox"
                      value={tag}
                      checked={checked}
                      onChange={() => this.toggleTag(checked, tag)}
                    />
                    <TagLabel
                      htmlFor={`tag-${tag}`}
                      key={`tag-item-${i}`}
                      onClick={e => this.toggleTag(checked, tag, e)}
                    >
                      {tag}
                    </TagLabel>
                    <TagDelete onClick={() => this.onRemoveTag(tag)}>
                      <i className="fa fa-close" />
                    </TagDelete>
                  </li>
                )
              })}
              {noResults && (
                <li>
                  <EmptyMessage>
                    <strong>No tags matched your search</strong>
                  </EmptyMessage>
                  <EmptyMessage>
                    Press enter to create the tag "{tag}"
                  </EmptyMessage>
                </li>
              )}
              {empty && (
                <li>
                  <EmptyMessage>
                    <strong>No tags created yet</strong>
                  </EmptyMessage>
                  <EmptyMessage>
                    Name your first tag and press enter
                  </EmptyMessage>
                </li>
              )}
            </TagList>
          </NewTagModal>
        )}
      </TagsContainer>
    )
  }
}

const Toggle = styled.div`
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all .1s linear;

  color: ${props => (props.noTags ? '#a1a3ab' : '#e85e6a')}

  &:hover {
    opacity: .7;
  }
`

const TagsTotalizer = styled.div`
  display: inline-block;
  font-weight: 300;
  font-size: 11px;
  height: 16px;
  width: 16px;
  background-color: #eb6975;
  color: white;
  border-radius: 50%;
  line-height: 16px;
  text-align: center;
  margin-left: 3px;
`

const NewTagModal = styled.div`
  width: 300px;
  max-width: 94vw;
  height: auto;
  position: absolute;
  right: -15px;
  top: 25px;
  background-color: white;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
  z-index: 10;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`

const TagsContainer = styled.div`
  display: inline-block;
`

const EmptyMessage = styled.span`
  padding: 10px;
  box-sizing: border-box;
  line-height: 1;
  text-align: center;
  font-size: 14px;
  display: inline-block;
  width: 100%;
  color: #a3a3a3;
`

const Checkbox = styled.input`
  position: absolute;
  top: 8px;
  left: 5px;
  z-index: 10;

  &:checked + label {
    background-color: #ececec;
  }
`

const TagLabel = styled.label`
  width: 100%;
  margin-top: 2px;
  margin-bottom: 2px;
  display: inline-block;
  cursor: pointer;
  padding: 3px 10px 5px 26px;
  box-sizing: border-box;
  border-radius: 3px;
  transition: all 0.1s linear;

  &:hover {
    background-color: #ececec;
  }
`

const TagDelete = styled.div`
  position: absolute;
  top: 8px;
  right: 5px;
  z-index: 10;
  cursor: pointer;
  color: #a0a0a0;
  border-radius: 50%;
  height: 18px;
  width: 18px;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TagList = styled.ul`
  width: 100%;
  list-style: none;
  display: inline-block;
  margin-top: 10px;
  box-sizing: border-box;
  padding: 0 10px 5px;

  > li {
    position: relative;
  }
`

const InputContainer = styled.div`
  float: left;
  position: relative;
  width: 100%;
`

const Input = styled.input`
  width: calc(100% - 20px);
  margin-top: 10px;
  margin-left: 10px;
  display: inline-block;
  background-color: transparent;
  border: none;
  background: #fff;
  font-weight: 100;
  font-size: 15px;
  padding: 10px 8px 11px 8px;
  box-sizing: border-box;
  border-radius: 6px;
  color: #74768a;
  box-shadow: inset 0px 0px 0px 1px #e8e8e8;

  &::placeholder {
    color: #c8c9d0;
    font-weight: 100;
  }
`

const mapStateToProps = state => ({
  tags: state.tasks.tags
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createTag,
      removeTag
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(enhanceWithClickOutside(Tags))
