import React from 'react';
import { connect } from 'react-redux';
import universal from 'react-universal-component';

const UniversalComponent = universal(({ page }) => import(`./${page}`), {
    minDelay: 500,
    loading: () => (
        <div>
            <div />
        </div>
    ),
    error: () => <div>Not found</div>
});

const Switcher = ({ page }) => (
    <div>
        <UniversalComponent page={page} />
    </div>
);

const mapState = state => ({
    page: state.page
});

export default connect(mapState)(Switcher);
