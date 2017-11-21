import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, Transition } from 'transition-group';
import universal from 'react-universal-component';
import Loading from '../Loading/Loading';
import Err from '../Error/Error';

const UniversalComponent = universal(({ page }) => import(`../${page}/${page}`), {
    minDelay: 500,
    loading: Loading,
    error: Err
});

function Switcher({ page, isLoading }) {
    return (
        <TransitionGroup
            duration={500}
            prefix="fade"
        >
            <Transition key={page}>
                <UniversalComponent page={page} />
            </Transition>
        </TransitionGroup>
    );
}

const mapState = ({ page, ...state }) => ({
    page,
});

export default connect(mapState)(Switcher);
