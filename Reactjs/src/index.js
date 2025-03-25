import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';


import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";


import { Provider } from 'react-redux';
import reduxStore, { persistor } from './redux';

import { GoogleAuthProvider } from "./containers/Auth/resources/googleAuth";

import { BrowserRouter } from "react-router-domv6";
import { HelmetProvider } from "react-helmet-async";

const renderApp = () => {
    ReactDOM.render(
        <Provider store={reduxStore}>
            <IntlProviderWrapper>
                <GoogleAuthProvider>
                    <HelmetProvider>
                        <BrowserRouter>
                            <App persistor={persistor}/>
                        </BrowserRouter>
                   </HelmetProvider>
                </GoogleAuthProvider>
            </IntlProviderWrapper>
        </Provider>,
        document.getElementById('root')
    );
};

renderApp();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
