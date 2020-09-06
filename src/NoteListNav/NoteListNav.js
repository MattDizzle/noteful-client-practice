import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import ApiContext from '../ApiContext'
import { countNotesForFolder } from '../notes-helpers'
import config from '../config'
import './NoteListNav.css'
import '../Note/Note.css'


export default class NoteListNav extends React.Component {
  static defaultProps ={
    onDeleteFolder: () => {}
   
  }

  static contextType = ApiContext;

  handleClickDelete = e => {
    // e.preventDefault()
    const folderId = e.currentTarget.value
    
    fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(() => {
        this.context.deleteFolder(folderId)
        // allow parent to perform extra behaviour
        this.props.onDeleteFolder(folderId)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render (){    
    const { folders=[], notes=[] } = this.context;
    console.log(`NoteListNav Context: ${this.context.folders}`)
    return (
    <div className='NoteListNav'>

      <ul className='NoteListNav__list'>

        {folders.map(folder =>
          <li key={folder.id} className='note' >
            <NavLink className='NoteListNav__folder-link' to={`/folders/${folder.id}`} >
              {folder.folder_name}
            </NavLink>

            <span className='NoteListNav__num-notes'>
                {countNotesForFolder(notes, folder.id)}
              </span>

            <button className='folder-delete' type='button' value={folder.id}  onClick={ this.handleClickDelete} >
                <FontAwesomeIcon icon='trash-alt' />
                {' '}
              </button>
          </li>
        )}
      </ul>
      <div className='NoteListNav__button-wrapper'>
        <CircleButton
          tag={Link}
          to='/add-folder'
          type='button'
          className='NoteListNav__add-folder-button'
        >
          <FontAwesomeIcon icon='plus' />
          <br />
          Folder
        </CircleButton>
      </div>
    </div>
    )
  }
}

