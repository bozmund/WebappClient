import './App.css';
import Navbar from './components/Navbar.js';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Bookingpage from './pages/Bookingpage.js';
import Loginpage from './pages/Loginpage.js';
import Registerpage from './pages/Registerpage.js';
import Profilepage from './pages/Profilepage.js';

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route exact path="/home" element={<Homepage />} />
          <Route path="/book/:roomid/:fromdate/:todate" element={<Bookingpage />} />
          <Route exact path="/login" element={<Loginpage />} />
          <Route exact path="/register" element={<Registerpage />} />
          <Route exact path="/profile" element={<Profilepage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;