import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = () => {
    return (
        <div className="d-flex justify-content-center align-items-center h-100 gap-1">
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="info" />
            <Spinner animation="grow" variant="primary" />
        </div>
    );
};

export default Loading;