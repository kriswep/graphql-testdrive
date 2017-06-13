/* globals localStorage */
import auth0 from 'auth0-js';
import history from '../history';

export default class Auth {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);

    this.auth0 = new auth0.WebAuth({
      domain: 'kriswep.eu.auth0.com',
      clientID: 'rfXisuwipfcqlSx0hNMraKj9eIX7oWLV',
      redirectUri: 'http://localhost:3000/callback',
      audience: 'https://kriswep.eu.auth0.com/userinfo',
      responseType: 'token id_token',
      scope: 'openid',
    });
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/home');
      } else if (err) {
        history.replace('/home');
        console.log(err); // eslint-disable-line no-console
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  setSession(authResult) {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(
      // eslint-disable-next-line no-mixed-operators
      authResult.expiresIn * 1000 + new Date().getTime(),
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    history.replace('/home');
  }

  // eslint-disable-next-line class-methods-use-this
  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/home');
  }

  // eslint-disable-next-line class-methods-use-this
  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
