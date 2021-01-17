import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./authentication/login";
import DashBoard from "./main/dashboard";
import Details from "./main/details";
import Account from "./main/account";
import myMatches from "./main/myMatches";
import Team from "./main/team";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={Login} />
        <Route path="/forgotpass" exact component={Login} />
        <Route path="/dashboard" exact component={DashBoard} />
        <Route path="/details" exact component={Details} />
        <Route path="/account" exact component={Account} />
        <Route path="/matches" exact component={myMatches} />
        <Route path="/team" exact component={Team} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
