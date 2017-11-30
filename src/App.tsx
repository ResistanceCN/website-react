import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Article from './components/Article';
import Join from './components/Join';
import Profile from './components/Profile';

export default () => (
    <Router>
        <Layout>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/page/:page" component={Home} />
                <Route path="/article/:id" component={Article} />
                <Route path="/join" component={Join} />
                <Route path="/form/:name" component={Home} />
                <Route path="/user/:id" component={Profile} />
                <Route component={Home} />
            </Switch>
        </Layout>
    </Router>
);
