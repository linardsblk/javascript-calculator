import React from "react";

export default class Display extends React.Component {

	render() {
    var displayText = this.props.calcElements.join("")+this.props.currentElement;
		return <div id="display">{displayText ? displayText : '0'}</div>;
	}
}
