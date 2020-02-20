import React from 'react';
import './App.css';
import Header from "./components/Header"
import Orders from "./components/Orders"

function App() {
    return (
        <div className="App">
            {/*
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            */}
            <Header/>
            <Orders/>
        </div>
    );
}

export default App;
