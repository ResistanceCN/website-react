import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Login from './Login';
import Article from './Article';
import Join from './Join';
import Profile from './Profile';
import Admin from './admin/Admin';

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
                <Route path="/admin" component={Admin} />
                <Route component={Home} />
            </Switch>
        </Layout>
    </Router>
);
