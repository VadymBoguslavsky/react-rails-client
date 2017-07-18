import React  from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import cookie from 'react-cookies'

const API_URL = `https://todo-react-rails-api.herokuapp.com/users`;
// const API_URL = `http://localhost:3000/users`;
const headers = { 'Content-Type': 'application/json', }
const token = cookie.load('token')

export function fetchUser(){
  return function(dispatch, getState) {
    if (cookie.load('token')) {
      let body = JSON.stringify({ token: token });

      axios.post(`${API_URL}/fetch_token`, body, { headers: headers })
        .then(res => {
          dispatch({ type: 'STORE_USER', payload: res.data });
        })
        .catch(e => {
          console.error("error: ", e);
        })
    }
  }
}

export function exitUser(){
  return function(dispatch, getState) {
    if (cookie.load('token')) {
      let body = JSON.stringify({ token: cookie.load('token') });

      axios.post(`${API_URL}/destroy_token`, body, { headers: headers })
        .then(res => {
          dispatch({ type: 'DELETE_TOKEN_USER', payload: res.data });
          cookie.remove('token', { path: '/' });

          browserHistory.push('#/users/log_in');
          setTimeout(() => {
            location.reload()
          }, 500)

          console.log("res", res)
        })
        .catch(e => {
          console.error("error: ", e);
        })
    }
  }
}

export function signUp(user){
  return function(dispatch, getState) {
    console.log(user);
    axios.post(`${API_URL}`, user, { headers: headers })
      .then(res => {
        if (res.status === 200) {
          browserHistory.push('#/users/log_in');
          setTimeout(() => {
            location.reload()
          }, 2000)
        }
      })
      .catch(e => {
        var err = e.response.data
        let alert_text = ""

        for( let i in err ){
          err[i].forEach((alert, j) => {
            alert_text += i + " " + alert + "; "
            console.log("alert_text", alert_text)
          })
        }
      })
  }
}

export function logIn(session){
  return function(dispatch, getState) {
    let body = JSON.stringify({ session: session });

    axios.post(`${API_URL}/create_token`, body, { headers: headers })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          cookie.save('token', res.data.token, { path: '/' });

          browserHistory.push('#/');
          setTimeout(() => {
            location.reload()
          }, 1000)
        }
      })
      .catch(e => {
        console.error("error: ", e);
      })
  }
}

export function emailConfirmation(email_token){
  return function(dispatch, getState) {
    axios.get(`${API_URL}/${email_token}/confirm_email`, { headers: headers })
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          browserHistory.push('#/users/log_in');
          setTimeout(() => {
            location.reload()
          }, 1500)
        }
      })
      .catch(e => {
        console.error("error: ", e);
      })
  }
}
