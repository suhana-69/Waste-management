import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Donation from "./components/Donation";
// Pages
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import DonorDashboard from "./components/DonorDashboard";
import NgoDashboard from "./components/NgoDashboard";
import VolunteerDashboard from "./components/VolunteerDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar shown on all pages */}
        <Navbar />

        {/* Routes */}
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/donate" component={Donation} />
          {/* Dashboards */}
          <Route path="/donor-dashboard" component={DonorDashboard} />
          <Route path="/ngo-dashboard" component={NgoDashboard} />
          <Route path="/volunteer-dashboard" component={VolunteerDashboard} />

          {/* Redirect unknown routes to home */}
          <Redirect to="/" />
        </Switch>

        {/* Global Chatbot (always visible) */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
