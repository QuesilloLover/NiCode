import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
import Sala from './components/Sala'
import ProblemCRUD from './components/ProblemCRUD';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="sala" element={<Sala/>}/>
          <Route path="crud" element={<ProblemCRUD />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
