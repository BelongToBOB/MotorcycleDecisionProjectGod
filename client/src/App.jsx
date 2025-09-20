import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserStore } from "./store/userStore";
import axios from "axios";
import { RecommendProvider } from "./context/RecommendContext";
import API_BASE_URL from "./config";

function App() {
  const { setUser, setToken, logout } = useUserStore();

  useEffect(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token) {
    setToken(token);

    if (user) {
      setUser(JSON.parse(user));   
    } else {
      // fallback: call API เพื่อเอา user
      axios.get(`${API_BASE_URL}/current-user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); 
      })
      .catch(() => logout());
    }
  }
}, [setUser, setToken, logout]);

  return (
    <RecommendProvider>
      <div className="App">
        <AppRoutes />
        <ToastContainer />
      </div>
    </RecommendProvider>
  );
}

export default App;
