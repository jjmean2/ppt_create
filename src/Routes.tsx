import React, { ReactElement } from "react";
import { Route, Switch } from "react-router-dom";
import PPTCreateLegacy from "views/PPTCreatLegacy";
import PPTGenerator from "views/PPTGenerator";

function Routes(): ReactElement {
  return (
    <Switch>
      <Route exact path="/">
        <PPTCreateLegacy />
      </Route>
      <Route exact path="/experimental">
        <PPTGenerator />
      </Route>
    </Switch>
  );
}

export default Routes;
