import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export class Toast extends React.Component {
    render() {
        return (
            <ToastContainer/>
        );
    }
}

connect()(Toast);
