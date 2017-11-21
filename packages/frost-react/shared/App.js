import React from 'react';

import Switcher from './components/Switcher/Switcher';
import styles from './App.css';

export default function App() {
    return (
        <div>
            <div className={styles.app}>
                <Switcher />
            </div>
        </div>
    );
}
