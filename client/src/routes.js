import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Home';
import Callback from './Callback';
import Auth from './Auth';
import history from './history';

const auth = new Auth();

export const handleAuthentication = (nextState) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

const makeMainRoutes = () =>
  (<BrowserRouter history={history} component={App}>
    <div>
      <Route
        /* exact*/ path="/"
        render={props => <App auth={auth} {...props} />}
      />
      <Route path="/home" render={props => <Home auth={auth} {...props} />} />
      <Route
        path="/callback"
        render={(props) => {
          handleAuthentication(props);
          return <Callback {...props} />;
        }}
      />
    </div>
  </BrowserRouter>);

export default makeMainRoutes;
