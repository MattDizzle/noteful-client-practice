import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddFolder.css'
import ValidationError from '../ValidationError'

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folder_name: { value: '', touched: false }
    }
  }

  static defaultProps = {
    history: {
      push: () => { }
    }
  }
  static contextType = ApiContext;

  updateFolderName(name) {
    this.setState({folder_name: {value: name, touched: true}});
  }

  validateFolderName() {
    const name = this.state.folder_name.value.trim();
    if (name.length === 0) {
      return 'Name is required';
    } else if (name.length < 3) {
      return 'Name must be at least 3 characters long';
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      folder_name: e.target['folder-name'].value
      
    }
    console.log(folder)
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {

    const nameError = this.validateFolderName();

    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name='folder-name' onChange={e => this.updateFolderName(e.target.value)} defaultValue="New folder" />
            {this.state.folder_name.touched && ( <ValidationError message={nameError} /> )}
          </div>
          <div className='buttons'>
            <button type='submit' disabled={ this.validateFolderName() }>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}