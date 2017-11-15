import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default function wrapRoute(Child, type) {
    function Target({ currentLocation, currentPayload }) {
        if (type === currentLocation) {
            return (
                <Child {...currentPayload} />
            );
        }

        return null;
    }

    Target.propTypes = {
        type: PropTypes.string,
        currentLocation: PropTypes.string,
        currentPayload: PropTypes.object
    };

    const mapState = (state, ownProps) => ({
        currentLocation: state.location.type,
        currentPayload: state.location.payload
    });

    return connect(mapState)(Target);
}
