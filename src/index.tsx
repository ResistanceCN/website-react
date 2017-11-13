import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';

import Home from './components/Home';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact={true} path="/" component={Home} />
            <Route path="/page/:page" component={Home} />
            <Route path="/article/:id" component={Home} />
            <Route path="/form/:name" component={Home} />
            <Route path="/user/:id" component={Home} />
            <Route component={Home}/>
        </Switch>
    </Router>,
    document.getElementById('root') as HTMLElement
);

serviceWorker.register();
