import logo from './logo.svg';
import './App.css';
import Login from './Login';
import {BrowserRouter ,Routes,Route} from "react-router-dom"
import Signup from './Signup';
import Person from './Person';

function App() {
  return (
  <>
  <BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login/>}></Route>
    {/* <Route path="/signup" element={<Signup/>}></Route> */}
    <Route path="/person" element={<Person/>}></Route>
  </Routes>
    {/* <Login/> */}
  </BrowserRouter>
  </>
  );
}

export default App;
