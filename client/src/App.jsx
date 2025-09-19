import { useEffect, useState } from 'react';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserStore } from './store/userStore';
import axios from 'axios';
import { RecommendProvider } from "./context/RecommendContext";

function App() {
  // const [count, setCount] = useState(0) // 
  const { setUser, setToken, logout } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      axios.get("http://localhost:5000/api/current-user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(() => {
        logout();
      });
    }
  }, [setUser, setToken, logout]);

  return (
    <RecommendProvider>
      <div className='App'>
        <AppRoutes />
        <ToastContainer />
      </div>
    </RecommendProvider>
  );
}

export default App;

