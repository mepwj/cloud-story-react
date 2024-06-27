import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import TodayPage from "./pages/TodayPage";
import WeekPage from "./pages/WeekPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => {
  const location = useLocation();
  const showNavbar = !["/login", "/create_account"].includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create_account" element={<CreateAccountPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/week" element={<WeekPage />} />
          <Route path="/profile-edit" element={<ProfilePage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
