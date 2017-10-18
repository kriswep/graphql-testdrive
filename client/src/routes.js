import React from 'react';
import { Route, Router } from 'react-router-dom';
import App from './App';
import Home from './Home';
import Callback from './Callback';
import Auth from './Auth';
import history from './history';

export const handleAuthentication = (auth, nextState) => {
  // const auth = new Auth();
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

const makeMainRoutes = () => {
  const auth = new Auth();
  return (
    <Router history={history} component={App}>
      <div>
        <Route
          /* exact*/ path="/"
          render={props => <App auth={auth} {...props} />}
        />
        <Route path="/home" render={props => <Home auth={auth} {...props} />} />
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(auth, props);
            return <Callback {...props} />;
          }}
        />
      </div>
    </Router>
  );
};

export default makeMainRoutes;
