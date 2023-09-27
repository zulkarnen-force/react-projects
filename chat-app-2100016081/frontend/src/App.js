import "./App.css";
import { Routes, Route } from 'react-router-dom';
import SignUp from './Pages/Auth/SignUp';
import Login from './Pages/Auth/Login';
import ChatPage from './Pages/ChatPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
