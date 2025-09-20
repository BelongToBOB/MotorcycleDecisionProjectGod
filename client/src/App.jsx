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
    if (token) {
      setToken(token);
      axios
        .get(`${API_BASE_URL}/current-user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const userData = res.data.payload ? res.data.payload : res.data;
          setUser(userData);
        })
        .catch(() => {
          logout();
        });
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
