import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { reducer } from './reducers';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Layout from './components/Layout';
import Home from './components/Home';
import Article from './components/Article';
import Join from './components/Join';
import Profile from './components/Profile';

const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Layout>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/page/:page" component={Home} />
                    <Route path="/article/:id" component={Article} />
                    <Route path="/join" component={Join} />
                    <Route path="/form/:name" component={Home} />
                    <Route path="/user/:id" component={Profile} />
                    <Route component={Home}/>
                </Switch>
            </Layout>
        </Router>
    </Provider>,
    document.getElementById('root') as HTMLElement
);

serviceWorker.register();
