import React from 'react';
import universal from 'react-universal-component';
import { NOT_FOUND } from 'react-first-router';
import { wrapRoute } from './internals/common';

const HomeRoute = wrapRoute(
    universal(() => import('./components/Home/Home')),
    'HOME'
);

class App extends React.Component {
    state = {
        alive: false
    };

    componentDidMount() {
        requestAnimationFrame(() => {
            this.setState({
                alive: true
            });
        });
    }

    render() {
        return (
            <div>
                <main>
                    <HomeRoute />
                </main>
            </div>
        );
    }
}

export default App;
