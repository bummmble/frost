import React from 'react';

export default function Error(error) {
    return (
        <div>
            {error.message}
        </div>
    );
}
