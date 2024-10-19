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
import Profile from './components/profile/Profile_view';
import Forum from './components/Forum';
import CourseManager from './components/CourseManager';
import CourseRenderer from './components/CourseRenderer';

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
          <Route path='codeEditor/:problemId' element={<CodeEditor />} />
          <Route path="problem/:problemId" element={<Coding/>}   />
          <Route path="forum" element={<Forum/>}   />
          <Route path='profile' element={<Profile/>}  />
          <Route path='courseManager' element={<CourseManager />} />
          <Route path='course/:courseId' element={<CourseRenderer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;