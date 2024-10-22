// src/App.js or App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LessonList from "./components/LessonList";
import DrillList from "./components/DrillList";
import LessonDetail from "./components/LessonDetail";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Home from "./components/Home";
import { ProfileProvider } from "./contexts/ProfileContext";

import DrillDetail from "./components/DrillDetail";
import { BglogProvider } from "./contexts/BgLogContext";
import Editor from "./components/Editor";
import GlossaryList from "./components/GlossaryList";

const steps = [
  { text: "Welcome to your backgammon training!" },
  { text: "Let’s learn how to move a checker." },
  { text: "Great job! Now roll the dice." },
];
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Set the login status when login is successful
  };

  return (
    <BglogProvider>
      <ProfileProvider>
        <Router>
          <Menu isLoggedIn={isLoggedIn} />{" "}
          {/* Pass isLoggedIn to show/hide login/profile buttons */}
          <div className="app-content position-relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/editor" element={<Editor />} />
              <Route
                path="/login"
                element={<Login onLoginSuccess={handleLoginSuccess} />} // Pass login handler to Login component
              />
              <Route
                path="/lessons"
                element={isLoggedIn ? <LessonList /> : <Navigate to="/login" />}
              />
              <Route
                path="/drills"
                element={isLoggedIn ? <DrillList /> : <Navigate to="/login" />}
              />
              <Route
                path="/drills/:glossaryId"
                element={
                  isLoggedIn ? <DrillDetail /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/glossary"
                element={
                  isLoggedIn ? <GlossaryList /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/lessons/:lessonId"
                element={
                  isLoggedIn ? <LessonDetail /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/profile"
                element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </ProfileProvider>
    </BglogProvider>
  );
}

export default App;
