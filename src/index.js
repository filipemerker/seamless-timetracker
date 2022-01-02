import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import App from './containers'
import { PersistGate } from 'redux-persist/lib/integration/react'

import './index.css'

const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <div>
        <App />
      </div>
    </PersistGate>
  </Provider>,
  target
)
