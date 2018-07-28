import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './parts/Layout';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Article from './Article';
import EditArticle from './EditArticle';
import NewArticle from './NewArticle';
import Join from './Join';
import Profile from './Profile';
import Admin from './admin/Admin';
import NotFound from './NotFound';

export default () => (
    <Router>
        <Layout>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/page/:page(\d+)" component={Home} />
                <Route exact path="/article/new" component={NewArticle} />
                <Route exact path="/article/:id(\w+)" component={Article} />
                <Route exact path="/article/:id(\w+)/edit" component={EditArticle} />
                <Route exact path="/join" component={Join} />
                <Route exact path="/form/:name(\w+)" component={Home} />
                <Route exact path="/user/:id(\w+)" component={Profile} />
                <Route path="/admin" component={Admin} />
                <Route component={NotFound} />
            </Switch>
        </Layout>
    </Router>
);
