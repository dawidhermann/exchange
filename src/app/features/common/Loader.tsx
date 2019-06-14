import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Loader.css';

export default function Loader() {
    return (
        <div className="loaderContainer">
            <CircularProgress color="primary" size={70}/>
        </div>
    );
}