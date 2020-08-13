import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faChevronLeft, faTrashAlt, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import { BrowserRoueter } from 'react-router-dom'
import 'typeface-roboto'
import './index.css'
import './index.css';
import App from '../App/App';

library.add(faPlus, faChevronLeft, faTrashAlt, faChackDouble)


ReactDOM.render(
  <BrowserRoueter>
    <App />
  </BrowserRoueter>,
  document.getElementById('root')
);

