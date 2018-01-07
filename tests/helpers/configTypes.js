export const BaseTypes = {
    'string': {
        success: 'hello',
        failure: false
    },
    'number': {
        success: 5,
        failure: 'failure'
    },
    'array': {
        success: ['array-success'],
        failure: false
    },
    'object': {
        'success': {key: 'object-success'},
        failure: false
    },
    'regex': {
        success: /\.js$/,
        failure: 'regex-failure'
    }
};

export const MixedTypes = {
    'string-or-bool': {
        success: 'string-or-bool-success',
        failure: {test: 'string-or-bool-failure'}
    },
    'object-or-bool': {
        success: {test: 'object-or-bool-success'},
        failure: 'object-or-bool-failure'
    },
    'object-or-bool-or-function': {
        success: {test: 'object-or-bool-or-function-success'},
        failure: 'object-or-bool-or-function-failure'
    }
};
