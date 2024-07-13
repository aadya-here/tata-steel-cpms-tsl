import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import SignInPage from "./pages/Signin";
import ProjectsPage from "./pages/Projects";
import FormsList from "./pages/FormsList";
import Profile from "./pages/Profile";
import Logs from "./pages/Logs";
import ProjectView from "./pages/ProjectViewById";
import LogView from "./pages/LogViewById";
import FormsView from "./pages/FormViewById";
import CreateProject from "./pages/CreateProject";
import ApprovalForm from "./pages/Approvals";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<SignInPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/forms" element={<FormsList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/projects/:projectId" element={<ProjectView />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/approval/:projectId" element={<ApprovalForm />} />


          <Route path="/logs/:logId" element={<LogView />} />
          <Route path="/forms/:formName/:formId/:formLogId" element={<FormsView />} />





          {/* {path: "/logs/:logId", element: <LogView /> },

          {path: "/projects/:projectId", element: <ProjectView /> }, */}






        </Routes>
      </AuthProvider>

    </Router>

  )
};

export default App;
