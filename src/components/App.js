import React, { Component } from 'react';
import firebase, { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import config from '../config/firebase-config';
import Header from './Header';

class App extends Component {
  constructor() {
    super();

    // Initialize Firebase
    firebase.initializeApp(config);
    firebase.firestore().settings({ timestampsInSnapshot: true });
  }

  render() {
    return (
      <Header />
    );
  }
}

export default App;