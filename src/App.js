import './App.css';
import Navbar from './components/Navbar.js';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route exact path="/home" element={<Homepage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;