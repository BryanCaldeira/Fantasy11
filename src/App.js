import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./authentication/login";
import DashBoard from "./main/dashboard";
import Details from "./main/details";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={Login} />
        <Route path="/forgotpass" exact component={Login} />
        <Route path="/dashboard" exact component={DashBoard} />
        <Route path="/details" exact component={Details} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
