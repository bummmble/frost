import { NOT_FOUND } from 'redux-first-router';

const components = {
    HOME: 'Home'
};

export default function pageReducer(state = 'HOME', action = {}) {
    return components[action.type] || state;
}

