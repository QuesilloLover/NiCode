import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
<<<<<<< HEAD
import Sala from './components/Sala'
=======
import ProblemCRUD from './components/ProblemCRUD';
>>>>>>> aea7e4c447e0099a9955dff47abfc5f78d3b1bae

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
<<<<<<< HEAD
          <Route path="sala" element={<Sala/>}/>
=======
          <Route path="crud" element={<ProblemCRUD />} />
>>>>>>> aea7e4c447e0099a9955dff47abfc5f78d3b1bae
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
