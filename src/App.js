/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import SearchBar from './components/header/SearchBar';
import Map from './components/map/Map';
import { MapProvider } from './context';
import './App.css';

function App() {
  return (
    <div className="App">
      <MapProvider>
        <SearchBar />
        <Map />
      </MapProvider>
    </div>
  );
}

export default App;
