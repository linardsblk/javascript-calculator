import React from "react";

export default class Button extends React.Component {
	handleClick = event => {
		if (this.props.onClick) {
			this.props.onClick(
				event,
				this.props.value ? this.props.value : this.props.text
			);
		}
	};
	render() {
		return (
			<div
				id={this.props.id}
				className="button"
				onClick={this.handleClick}
				value={this.props.value}
			>
				{this.props.text}
			</div>
		);
	}
}
