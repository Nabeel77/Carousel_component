import React from 'react';
import './Dots.css';

const dots = (props) => (
    <div className={props.active ? 'dot active' : 'dot'} id={props.dotId} onClick={props.clicked}/>
);

export default dots;