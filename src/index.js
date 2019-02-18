import "./public-path";
import React from "react";
import ReactDOM from "react-dom";
import App from "@UI/App";
//import registerServiceWorker from "./registerServiceWorker";
import { hot } from "react-hot-loader";

import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import arLocale from 'date-fns/locale/es';

//REDUX
import { Provider } from "react-redux";
import Store, { history } from "@Redux/Store/index";

//Router
import { ConnectedRouter } from "connected-react-router";

//Theme
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#fff"
    },
    secondary: {
      main: "#149257"
    },
    background: {
      default: "#eee"
    }
  },
  button: {
    display: 'inline-block',
    minWidth: 'auto',
    margin: '2px',
    borderRadius: '20px'
  },
  color: {
    ok: {
      main: "#149257"
    },
    error: {
      main: "#F44336"
    },
    info: {
      main: "#2196f3"
    }
  }
});

hot(module)(App);
ReactDOM.render(
  <Provider store={Store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        {/* <HotApp /> */}
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={arLocale}>
          <App />
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

//registerServiceWorker();
