import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
import Sala from './components/Sala'
import ProblemCRUD from './components/ProblemCreateForm';
import Coding from './components/CodingEnv';
import CodeEditor from './components/CodeEditor'
import ProblemCreateForm from './components/ProblemCreateForm';
import AddTestCaseForm from './components/TestcasesCreateForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="sala" element={<Sala/>}/>
          <Route path="crud" element={<ProblemCreateForm />} />
          <Route path='testcases/:problemId' element={<AddTestCaseForm />} />
          <Route path='codeEditor' element={<CodeEditor />} />
          <Route path="coding" element={<Coding/>}   />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// function App() {
//   return (
//     <div className="App">
//       <CodeEditor />
//     </div>
//   );
// }


