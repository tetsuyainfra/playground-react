import React from 'react';
// import logo from './logo.svg';
import './App.css';

import {GlobalProvider, stateContext, dispatchContext} from './store'

// import {initialState, reducer} from './reducer'

import {Api} from './api'

const Father: React.FC<{}> = (props) =>{
  const state = React.useContext(stateContext)
  const dispatch = React.useContext(dispatchContext)

  const handleIncrementTwice = async () =>{
    dispatch({type: 'increment'})
    dispatch({type: 'increment'})
  }

  return (
    <div>
      <h1>
        Father : {state.count}
        <input type="button" onClick={()=>{dispatch({type: 'increment'})}} value="+"/>
        <input type="button" onClick={()=>{dispatch({type: 'decrement'})}} value="-"/>
        <input type="button" onClick={()=>{dispatch({type: 'reset'})}} value="reset"/>
        <input type="button" onClick={handleIncrementTwice} value="twice"/>
      </h1>
      {props.children}
    </div>
  )
}

const delayRun = (waitSeconds :number, someFunction: Function) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(someFunction())
    }, waitSeconds)
  })
}


const Child: React.FC<{}> = (props) =>{
  const state = React.useContext(stateContext)
  const dispatch = React.useContext(dispatchContext)

  const handleIncrementTwiceLater = async () =>{
    dispatch({type: 'increment'})
    delayRun(1000,()=>{
      dispatch({type: 'increment'})
    })
  }

  return (
    <div>
      <h1>
        Child : {state.count}
        <input type="button" onClick={()=>{dispatch({type: 'increment'})}} value="+"/>
        <input type="button" onClick={()=>{dispatch({type: 'decrement'})}} value="-"/>
        <input type="button" onClick={()=>{dispatch({type: 'reset'})}} value="reset"/>
        <input type="button" onClick={handleIncrementTwiceLater} value="later"/>
      </h1>
      {props.children}
    </div>
  )
}

const GrandChild: React.FC<{}> = (props) =>{
  const state = React.useContext(stateContext)
  const dispatch = React.useContext(dispatchContext)

  const callApi = async () => {
    dispatch({type: 'set_ip', payload: "loading...."})

    Api.createIp().get()
    .then((data: {ip: string})=>{
      dispatch({type: 'set_ip', payload: data.ip})
    })
  }

  const callApiDelay = async () => {
    dispatch({type: 'set_ip', payload: "loading...."})

    Api.createIp().get({delay: 5000})
    .then((data: {ip: string})=>{
      dispatch({type: 'set_ip', payload: data.ip})
    })
  }

  return (
    <div>
      <h1>
        GrandChild : {state.ip}
        <input type="button" onClick={callApi} value="api"/>
        <input type="button" onClick={callApiDelay} value="apiDelay"/>
      </h1>
      {props.children}
    </div>
  )
}


const Family: React.FC<{}> = (props) =>{
  return  (
      <Father>
        <Child>
          <GrandChild />
        </Child>
        <Child />
        <Child />
      </Father>
      )
}

const App = () => {
  return (
    <div className="App">
      <GlobalProvider>
        <Family />
      </GlobalProvider>
    </div>
  );
}

export default App;
