/* globals document */
// import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import makeMainRoutes from './routes';
import './index.css';

const routes = makeMainRoutes();

ReactDOM.render(
  routes,
  document.getElementById('root') || document.createElement('div'),
);
registerServiceWorker();
