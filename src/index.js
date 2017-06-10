import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import App from './App';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

//Integration to firebase with key and domain in initialize
firebase.initializeApp({
	apiKey: "AIzaSyA_CabkMqhzqfW1iaPWjrI1R4-Y5q0IQZ0",
    authDomain: "photolog-b7681.firebaseapp.com",
    databaseURL: "https://photolog-b7681.firebaseio.com",
    projectId: "photolog-b7681",
    storageBucket: "photolog-b7681.appspot.com",
    messagingSenderId: "204200343729"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
