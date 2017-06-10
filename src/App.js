import React, { Component } from 'react';
import firebase from 'firebase';

import FileUpload from './component/fileupload/FileUpload';

import './App.css';

class App extends Component {
  // Initialize constructor of the class
  constructor(){
    super();
    this.state = {
      user: null,
      pictures: [],
      uploadValue: 0
    };

    // Initialize the methods listener 
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  //
  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user});
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });
  }

  //
  handleSignIn(){
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then( result => console.log(`${result.user.email} ha iniciado session`))
      .catch( error => console.log(`Error ${error.code}: ${error.message}`));
  }

  //
  handleLogOut(){
    firebase.auth().signOut()
      .then( result => console.log(`Ha cerrado sesión`))
      .catch( error => console.log(`Error ${error.code}: ${error.message}`));
  }

  // Receiving a change event
  handleUpload(event){
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/photos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      var percent = parseInt(((snapshot.bytesTransferred / snapshot.totalBytes) * 100),10);
      this.setState({
        uploadValue: percent
      });
    },error => {
      console.log(error.message);
    },() => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };

      const dbRef = firebase.database().ref('pictures');

      const newPicture = dbRef.push();

      newPicture.set(record);
    });
  }

  //
  renderPostImage(){
    return(
      this.state.pictures.map((picture, p) => (
        <div key={p} className="App-card">
          <div className="App-card-image">
            <img width="320" src={picture.image} alt="" />
              <div className="App-card-footer">
                  <img className="App-card-avatar" src={picture.photoURL} alt={picture.displayName} />
                  <span className="App-card-name">
                    {picture.displayName}
                  </span>
              </div>
          </div>
        </div>
      )).reverse()
    );
  }

  //
  renderLoginButton(){
    // If user is logged
    if(this.state.user){
      return (
        <div className="App-intro">
          <img className="App-card-avatar" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          
          <p className="App-intro"> Hi {this.state.user.displayName}!</p>

          <button className="App-btn" onClick={this.handleLogOut}>Logout</button>
                          
          <FileUpload onUpload={this.handleUpload} onUploadValue={this.state.uploadValue} />

          <br/>

          { this.renderPostImage() }

        </div>
      );
    }else{
      return (
        <button className="App-btn" onClick={this.handleSignIn}>Login with Google</button>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Photolog</h2>
        </div>
        <div className="App-intro">
          { this.renderLoginButton() }
        </div>
      </div>
    );
  }
}

export default App;﻿