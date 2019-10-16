import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Visual from './components/Visual/Visual';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={ Home } />
      <Route path="/vis" component={ Visual } />
    </BrowserRouter>
  );
}

export default App;
