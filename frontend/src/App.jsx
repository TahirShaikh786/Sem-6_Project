import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectRoutes from "./Service/ProtectRoutes";
import Dashboard from "./Pages/Dashboard";
import Error from "./Pages/Error";
import MoreInfo from "./Pages/MoreInfo";
import AllVideo from "./Pages/AllVideo";
import Categories from "./Pages/Categories";
import Search from "./Pages/Search";
import Profile from "./Pages/Profile";
import Favourites from "./Pages/Favourites";
import Admin from "./Admin_Pages/Admin";
import UserDetails from "./Admin_Pages/UserDetails";
import Maps from "./Pages/Maps";
import Rated from "./Pages/Rated";
import Booking from "./Pages/Booking";
import CreateMovieForm from "./Admin_Pages/CreateMovieForm";
import Success from "./Pages/Success";

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
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/rated" element={<Rated />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:categoryName" element={<Categories />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/user/:id" element={<UserDetails />} />
            <Route path="/admin/movies" element={<CreateMovieForm />} />
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
