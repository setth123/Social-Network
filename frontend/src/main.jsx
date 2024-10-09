import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'


import {persistReducer,persistStore,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER} from 'redux-persist'
import {PersistGate} from "redux-persist/integration/react";
import authReducer from './states/index.js';
import storage from "redux-persist/lib/storage";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig={key:"root",storage,version:1};
const persistedReducer=persistReducer(persistConfig,authReducer); 
const store=configureStore({
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER]
      },
    }),
})


createRoot(document.getElementById('root')).render(
  <React.StrictMode>  
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
