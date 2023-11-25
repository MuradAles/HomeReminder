import './App.css';
import Homepage from './components/Homepage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import HomesView from './components/HomesView';
import HomeView from './components/HomeView';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div>
        <header className="appHeader">
          <h1 className="appTitle">Home Reminder</h1>
          <Navigation/>
        </header>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/homes/:userId" element={<HomesView />} />
          <Route path="/homes/:userId/home/:homeId" element={<HomeView/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
