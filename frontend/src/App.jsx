import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectRoutes from "./Service/ProtectRoutes";
import Dashboard from "./Pages/Dashboard";
import Error from "./Pages/Error";
import MoreInfo from "./Pages/MoreInfo";
import AllVideo from "./Pages/AllVideo";
import Categories from "./Pages/Categories";
import Action from "./Pages/Action";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectRoutes />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/Watch/:id" element={<MoreInfo />} />
            <Route path="/allVideo" element={<AllVideo />} />
            <Route path="/categories" element={<Categories />}>
              <Route path="action" element={<Action />} />
            </Route>
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
