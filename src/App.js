import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
// import { ZIndexProvider } from "./functions/Zindexer";
// import { BldgInfoDataProvider } from "./hooks/useBldgInfoData";
// import { CookieDataProvider } from "./hooks/useCookieData";
// import { OverlayReloaderProvider } from "./hooks/useOverlayReloader";
// import { UnitTypeProvider } from "./hooks/useUnitType";
// import { ValuationCalculatorProvider } from "./hooks/useValuationCalculator";
import { TestPage, LawPage } from "./pages";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={TestPage} />
        <Route exact path="/law" component={LawPage} />
      </Switch>
    );
  }
}

export default App;
