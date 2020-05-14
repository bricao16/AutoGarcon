import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
//import all the fonts
import './assets/fonts/BenchNine-Regular.ttf'
import './assets/fonts/Lato-Regular.ttf'
import './assets/fonts/Lora-Regular.ttf'
import './assets/fonts/Merriweather-Regular.ttf'
import './assets/fonts/Montserrat-Regular.ttf'
import './assets/fonts/OpenSans-Regular.ttf'
import './assets/fonts/Oswald-Regular.ttf'
import './assets/fonts/PlayfairDisplay-Regular.ttf'
import './assets/fonts/PTSans-Regular.ttf'
import './assets/fonts/Raleway-Medium.ttf'


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();