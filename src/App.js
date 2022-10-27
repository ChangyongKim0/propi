import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { GlobalVarProvider } from "./hooks/useGlobalVar";
import { GlobalDataProvider } from "./hooks/useGlobalData";
// import { ZIndexProvider } from "./functions/Zindexer";
// import { BldgInfoDataProvider } from "./hooks/useBldgInfoData";
// import { CookieDataProvider } from "./hooks/useCookieData";
// import { OverlayReloaderProvider } from "./hooks/useOverlayReloader";
// import { UnitTypeProvider } from "./hooks/useUnitType";
// import { ValuationCalculatorProvider } from "./hooks/useValuationCalculator";
import {
  DashboardPage,
  HomePage,
  TestPage,
  LawPage,
  NewsPage,
  NotFound,
} from "./pages";

class App extends Component {
  render() {
    return (
      <GlobalVarProvider>
        <GlobalDataProvider>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/dashboard" component={DashboardPage} />
            <Route exact path="/test" component={TestPage} />
            <Route exact path="/law" component={LawPage} />
            <Route exact path="/news" component={NewsPage} />
            <Route component={NotFound} />
          </Switch>
        </GlobalDataProvider>
      </GlobalVarProvider>
    );
  }
}

export default App;
