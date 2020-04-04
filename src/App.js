import React from 'react';
import './App.css';
import Navigation from './components/navigation/navigation';
import Logo from './components/logo/Logo.js';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm.js';
import Rank from './components/rank/Rank.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Signin from './components/signin/Signin.js';
import Register from './components/register/Register.js';

const app = new Clarifai.App({
  apiKey: '3e8b593a48614dab84921b585f96d289'
 });

class App extends React.Component{

  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email:'',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email:data.email,
        entries:data.entries,
        joined: data.joined
    }})
  }



  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
     Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then( response =>{
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count=> {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
      }
        this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    }
    else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() 
  {
    return (
        <div className="App">
          <Particles className = 'particles' 
                  params={{
                    particles: {
                    number: {
                      value: 150,
                      density: {
                        enable: true,
                        value_area: 800
                      }
                    }
                    }
                  }}
            />



          <Navigation onRouteChange = {this.onRouteChange} isSignedIn = {this.state.isSignedIn}/>
          {this.state.route === 'home'
            ? <div>
            <Logo/>
            <Rank name = {this.state.user.name} entries = {this.state.user.entries}/>
            <ImageLinkForm onInputChange = {this.onInputChange} 
                            onButtonSubmit = {this.onButtonSubmit}
            />
            <FaceRecognition box = {this.state.box} imageUrl = {this.state.imageUrl}/>
          </div>
            : (
              this.state.route === 'signin'
              ? <Signin loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
              : <Register onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/>
            )
            
  }
        </div>
    );
  }
}

export default App;