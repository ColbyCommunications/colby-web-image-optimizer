import React from 'react';
import { Router } from '@reach/router';
import Home from './Home';
import Wordpress from './Wordpress';

const App = () => {
    return (
        <Router>
            <Home path="/" />
            <Wordpress path="directory-image-optimizer" />
        </Router>
    );
};

export default App;
