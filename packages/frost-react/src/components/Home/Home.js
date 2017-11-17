import React from 'react';
import Helmet from 'react-helmet';
import Styles from './Home.css';

export default function Home() {
    return (
        <div className={Styles.home}>
            <Helmet title="home" />
            <p>Home</p>
        </div>
    );
}
