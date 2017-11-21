import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';

import Layout from './components/Layout';
import Home from './components/Home';
import Article from './components/Article';
import Join from './components/Join';
import Profile from './components/Profile';

ReactDOM.render(
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
    </Router>,
    document.getElementById('root') as HTMLElement
);

serviceWorker.register();
