import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate
        loading={
          <div className="min-h-screen flex justify-center items-center bg-[#fffbea] text-black">
            <p className="text-lg font-bold animate-pulse">Loading...</p>
          </div>
        }
        persistor={persistor}
      >
      <App />
    </PersistGate>
  </Provider>,
)
