import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";

// Pages
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DonorDashboard from "./components/DonorDashboard";
import NgoDashboard from "./components/NgoDashboard";
import VolunteerDashboard from "./components/VolunteerDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        {/* Dashboards */}
        <Route path="/donor-dashboard" component={DonorDashboard} />
        <Route path="/ngo-dashboard" component={NgoDashboard} />
        <Route path="/volunteer-dashboard" component={VolunteerDashboard} />

        {/* Redirect any unknown route to home */}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
