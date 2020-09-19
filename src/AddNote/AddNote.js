import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddNote.css'
import ValidationError from '../ValidationError'

export default class AddNote extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: { value: '', touched: false },
      content: {value: '', touched: false}
    }
  }

  static defaultProps = {
    history: {
      push: () => { }
    }
  }
  static contextType = ApiContext;

  updateName(name) {
    this.setState({name: {value: name, touched: true}});
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return 'Name is required';
    } else if (name.length < 3) {
      return 'Name must be at least 3 characters long';
    }
  }

  updateContent(content) {
    this.setState({content: {value: content, touched: true}});
  }

  validateContent() {
    const content = this.state.content.value.trim();
    if (content.length === 0) {
      return 'content is required';
    } else if (content.length < 3) {
      return 'content must be at least 3 characters long';
    }
  }



  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
      note_name: e.target['note-name'].value,
      content: e.target['note-content'].value,
      folder_id: e.target['note-folder-id'].value,
      modified: new Date(),
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { folders=[] } = this.context
    const nameError = this.validateName();
    const contentError = this.validateContent();
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='note-name' onChange={e => this.updateName(e.target.value)} />
            {this.state.name.touched && ( <ValidationError message={nameError} /> )}
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content' onChange={e => this.updateContent(e.target.value)} />
            {this.state.name.touched && ( <ValidationError message={contentError} /> )}
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id'>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.folder_name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={ this.validateName() || this.validateContent() }>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}