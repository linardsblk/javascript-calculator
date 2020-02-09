import React from "react";
import Display from "./Display";
import Button from "./Button";

const operatorRegEx = /-|\+|X|\//;
const numberRegEx = /\d+.?\d*/;

export default class Calculator extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentElement: "",
			calcElements: []
		};

		this.clearButton = this.clearButton.bind(this);
		this.numbersButton = this.numbersButton.bind(this);
		this.operatorButton = this.operatorButton.bind(this);
		this.decimalButton = this.decimalButton.bind(this);
		this.previousElement = this.previousElement.bind(this);
	}

	previousElement = () => {
		return this.state.calcElements[this.state.calcElements.length - 1];
	};

	clearButton() {
		this.setState({
			currentElement: "",
			calcElements: []
		});
	}

	numbersButton = (e, value) => {
		// Validates if value passed is digit
		if (/\D/.test(value)) return;

		// If current element is a number
		if (
			!this.state.currentElement ||
			numberRegEx.test(this.state.currentElement)
		) {
			// Do not allow multiple zeros and a zero at start
			if (this.state.currentElement === "0") {
				this.setState(prevState => ({
					currentElement: value
                }));
                return ;
			}
			this.setState(prevState => ({
				currentElement: prevState.currentElement + value
			}));
			return ;
		}
        // Special case where current element is '-' and previous is an operator
        if(this.state.currentElement === '-' && operatorRegEx.test(this.previousElement())) {
            this.setState(prevState => ({
				currentElement: prevState.currentElement + value
            }));
            return ;
        }

		// If current element is an operator
		if (operatorRegEx.test(this.state.currentElement)) {
			this.setState(prevState => ({
				calcElements: [
					...prevState.calcElements,
					prevState.currentElement
				],
				currentElement: value
			}));
			return;
		}
	};

	operatorButton = (e, value) => {
		var localCurrentElement = this.state.currentElement;
		//Validates if operator is passed
		if (!operatorRegEx.test(value)) return;
        
		// If current element is a number
		if (numberRegEx.test(localCurrentElement)) {
			// If number ends with a decimal, remove decimal
			if (String(localCurrentElement).endsWith("."))
				localCurrentElement = String(localCurrentElement).slice(
					0,
					value.length - 2
				);

			this.setState(prevState => ({
				calcElements: [...prevState.calcElements, localCurrentElement],
				currentElement: value
			}));
			return;
		}

		// If current element is an operator
		if (operatorRegEx.test(localCurrentElement)) {
            // Special case where there are 2 operators in a row already and another is entered. eg. 5X- then /
            if(operatorRegEx.test(this.previousElement()))
            {
                var tempArray = [...this.state.calcElements];
                tempArray.pop();
                this.setState(prevState => ({
                    calcElements: tempArray,
                    currentElement: value
                }));
                return;
            }

            // Special case where '-' is allowed after 'X' and '/'
            if(value === '-' && (localCurrentElement === 'X' || localCurrentElement === '/')) {
                this.setState(prevState => ({
                    calcElements: [...prevState.calcElements, localCurrentElement],
                    currentElement: value
                }));
                return;
            }
			this.setState({
				currentElement: value
			});
			return;
		}
	};

	decimalButton = (e, value) => {
		// If current element already has decimal
		if (/\./.test(this.state.currentElement)) return;
		else {
			this.setState(prevState => ({
				currentElement: prevState.currentElement + value
			}));
		}
	};

	calculateButton = () => {
		var i = 0;
		var localCalcElements = [
			...this.state.calcElements,
			this.state.currentElement
		];

		var doCalculation = operator => {
			var temp = 0;
			switch (operator) {
				case "+":
					temp =
						Number(localCalcElements[i - 1]) +
						Number(localCalcElements[i + 1]);
					break;
				case "-":
					temp =
						Number(localCalcElements[i - 1]) -
						Number(localCalcElements[i + 1]);
					break;
				case "X":
					temp =
						Number(localCalcElements[i - 1]) *
						Number(localCalcElements[i + 1]);
					break;
				case "/":
					temp =
						Number(localCalcElements[i - 1]) /
						Number(localCalcElements[i + 1]);
					break;
				default:
					return;
			}
			localCalcElements.splice(i - 1, 3, temp);
			i = i - 2;
		};

		// Calculates multiply and division first
		for (i = 0; i < localCalcElements.length; i++) {
			if (localCalcElements[i] === "X" || localCalcElements[i] === "/") {
				doCalculation(localCalcElements[i]);
			}
		}

		// Calculates addition and subtraction after
		for (i = 0; i < localCalcElements.length; i++) {
			if (localCalcElements[i] === "+" || localCalcElements[i] === "-") {
				doCalculation(localCalcElements[i]);
			}
		}

		this.setState((prevState, props) => ({
			calcElements: [],
			currentElement: localCalcElements[0]
		}));
	};

	render() {
		return (
			<div className="calculator">
				<Display
					calcElements={this.state.calcElements}
					currentElement={this.state.currentElement}
				/>
				<Button id="clear" text="AC" onClick={this.clearButton} />
				<Button id="divide" text="/" onClick={this.operatorButton} />
				<Button id="multiply" text="X" onClick={this.operatorButton} />
				<Button id="seven" text="7" onClick={this.numbersButton} />
				<Button id="eight" text="8" onClick={this.numbersButton} />
				<Button id="nine" text="9" onClick={this.numbersButton} />
				<Button id="subtract" text="-" onClick={this.operatorButton} />
				<Button id="four" text="4" onClick={this.numbersButton} />
				<Button id="five" text="5" onClick={this.numbersButton} />
				<Button id="six" text="6" onClick={this.numbersButton} />
				<Button id="add" text="+" onClick={this.operatorButton} />
				<Button id="one" text="1" onClick={this.numbersButton} />
				<Button id="two" text="2" onClick={this.numbersButton} />
				<Button id="three" text="3" onClick={this.numbersButton} />
				<Button id="equals" text="=" onClick={this.calculateButton} />
				<Button id="zero" text="0" onClick={this.numbersButton} />
				<Button id="decimal" text="." onClick={this.decimalButton} />
			</div>
		);
	}
}
