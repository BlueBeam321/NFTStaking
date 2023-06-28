import React from "react";

export default class StatefulComponent extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}
    }
}
