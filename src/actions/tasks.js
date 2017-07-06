import axios from 'axios';
import cookie from 'react-cookies'

const API_URL = `http://localhost:3000/todos`;
let headers = { 'Content-Type': 'application/json', }
const token = cookie.load('token')

export function fetchTasks(user_id){
  return function(dispatch, getState) {
    let body = JSON.stringify({ token: token });

    axios.get(`${API_URL}`, body, { headers: headers })
      .then(res => {
        if (res.status === 200) {
          console.log(res)
          dispatch({ type: 'GET_TASKS', payload: res.data });
          // dispatch({ type: 'LOADER' });
        }
      })
      .catch(e => {
        console.error("error: ", e);
      })
  }
}
export function deleteTask(id){
  return function(dispatch, getState) {
    let body = { token: token }
    axios.delete(`${API_URL}/${id}`, { params: body, headers: headers })
      .then(res => {
        dispatch({ type: 'DELETE_TASK', payload: id });
      })
      .catch(id => {
        console.error("error", id);
      })
  }
}



  export function addTask(task){
  return function(dispatch, getState) {
    let body = JSON.stringify({todo: task, token: token});
console.log(body)
    axios.post(API_URL, body, { headers: headers })
      .then(res => {
        dispatch({ type: 'ADD_TASK', payload: res.data });

      })
      .catch(e => {
        console.error(e);

      })
  }
}

export function completedTask(id, active){
  return function(dispatch, getState) {
    if (active === true) {
      active = false
    } else {
      active = true
    }

    let task = {id: id, completed: active}
    let body = {todo: task, token: token}

    axios.patch(`${API_URL}/${task.id}`, body, { headers: headers })
      .then(res => {
        dispatch({ type: 'COMPLITED_TASK', payload: res.data });
      })
      .catch(e => {
        console.error("error: ", e);
      })
  }
}