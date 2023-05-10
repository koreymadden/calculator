import React, { useRef } from 'react';
import { useState, useEffect } from 'react';

function Calculator() {
	const [currentDisplay, setCurrentDisplay] = useState('0');
	const [toolText, setToolText] = useState('Click to copy to clipboard!');
	const [resultDisplayed, setResultDisplayed] = useState(false);
	const [clicked, setClicked] = useState(false);
	const [operator, setOperator] = useState<string | null>(null);
	const [previousOperator, setPreviousOperator] = useState<string | null>(null);
	const [previousNumber, setPreviousNumber] = useState<string | null>(null);
	const [storedValue, setStoredValue] = useState<string | null>(null);
	const [keyDown, setKeyDown] = useState<string | null>(null);
	const displayRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		const displayElement = displayRef.current;
		if (!displayElement) return;
		displayElement.addEventListener('mouseleave', handleMouseLeave);
		return () => {
			displayElement.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	useEffect(() => {
		if (keyDown !== null) {
			routeKeyDown(keyDown);
			setKeyDown(null);
		}
	}, [keyDown]);

	useEffect(() => {
		if (clicked) {
			setToolText('Copied!');
		} else {
			setToolText('Click to copy to clipboard!');
		}
	}, [clicked]);

	const routeKeyDown = (key: string) => {
		switch (key) {
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				handleNumber(key);
				break;

			case '.':
				handleDecimal();
				break;

			case '+':
			case '-':
			case '/':
			case '*':
			case '%':
				handleOperator(key);
				break;

			case 'Enter':
				handleResult();
				break;

			case 'Backspace':
			case 'Escape':
			case 'Delete':
				handleClear();
				break;

			default:
				break;
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		setKeyDown(e.key);
	};

	const handleClear = () => {
		setCurrentDisplay('0');
		setOperator(null);
		setStoredValue(null);
		setResultDisplayed(false);
		setPreviousNumber(null);
		setPreviousOperator(null);
	};

	const handleNumber = (numString: string) => {
		if (operator && typeof storedValue !== 'string') {
			setStoredValue(currentDisplay);
			setCurrentDisplay(numString);
		} else {
			if (
				(currentDisplay === '0' || currentDisplay === '-0') &&
				numString === '0'
			)
				return;
			if (
				(currentDisplay === '0' || currentDisplay === '-0') &&
				numString !== '0'
			) {
				setCurrentDisplay(numString);
			} else if (resultDisplayed) {
				setCurrentDisplay(numString);
				setResultDisplayed(false);
			} else {
				setCurrentDisplay((oldValue) => oldValue + numString);
			}
		}
	};

	const handleOperator = (operatorVal: string) => {
		setResultDisplayed(false);
		if (typeof storedValue !== 'string' && operator === operatorVal) {
			setOperator(null);
		} else if (typeof storedValue !== 'string') {
			setOperator(operatorVal);
		} else if (storedValue) {
			handleResult(operatorVal);
		}
	};

	const handlePercentage = () => {
		setCurrentDisplay((oldValue) => (Number(oldValue) / 100).toString());
		setResultDisplayed(true);
	};

	const handleDecimal = () => {
		setResultDisplayed(false);
		if (typeof storedValue !== 'string' && operator) {
			setStoredValue(currentDisplay);
			setCurrentDisplay('0.');
		} else if (previousOperator && resultDisplayed) {
			setCurrentDisplay('0.');
		} else {
			if (currentDisplay.indexOf('.') !== -1) return;
			setCurrentDisplay((oldValue) => oldValue + '.');
		}
	};

	const handlePosNeg = () => {
		if (typeof storedValue !== 'string' && operator) {
			setStoredValue(currentDisplay);
			setCurrentDisplay('-0');
		} else {
			setCurrentDisplay((oldValue) =>
				oldValue.indexOf('-') === -1
					? '-' + oldValue
					: oldValue.replace('-', '')
			);
		}
	};

	const handleResult = (
		nextOperator: string | null = null,
		numberOne?: string,
		numberTwo?: string,
		selectedOperator?: string
	) => {
		if (
			(operator || selectedOperator) &&
			(currentDisplay || numberTwo) &&
			(storedValue || numberOne)
		) {
			const firstNumber = numberOne ?? storedValue;
			const secondNumber = numberTwo ?? currentDisplay;
			const usedOperator = selectedOperator ?? operator;

			switch (usedOperator) {
				case '+':
					setCurrentDisplay(
						(Number(firstNumber) + Number(secondNumber)).toString()
					);
					break;
				case '-':
					setCurrentDisplay(
						(Number(firstNumber) - Number(secondNumber)).toString()
					);
					break;
				case '*':
					setCurrentDisplay(
						(Number(firstNumber) * Number(secondNumber)).toString()
					);
					break;
				case '/':
					setCurrentDisplay(
						(Number(firstNumber) / Number(secondNumber)).toString()
					);
					break;

				default:
					break;
			}
			setPreviousOperator(usedOperator);
			setPreviousNumber(secondNumber);
			setStoredValue(null);
			setOperator(nextOperator);
			setResultDisplayed(true);
		} else if (previousOperator && previousNumber) {
			handleResult(null, currentDisplay, previousNumber, previousOperator);
		} else if (currentDisplay && operator) {
			switch (operator) {
				case '+':
					handleResult(null, currentDisplay, currentDisplay, operator);
					break;
				case '-':
					handleResult(null, currentDisplay, currentDisplay, operator);
					break;
				case '*':
					handleResult(null, currentDisplay, currentDisplay, operator);
					break;
				case '/':
					handleResult(null, currentDisplay, currentDisplay, operator);
					break;

				default:
					break;
			}
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(currentDisplay);
		setClicked(true);
	};

	const handleMouseLeave = () => {
		setClicked(false);
	};

	return (
		<div className='Calculator'>
			<div className='display' ref={displayRef} onClick={handleCopy}>
				<div className={`tooltip ${clicked ? 'clicked-tip' : ''}`}>
					{toolText}
				</div>
				<div
					className={`display-text ${
						currentDisplay.length > 13 ? 'smallerText' : ''
					}`}
				>
					{currentDisplay}
				</div>
			</div>
			<div className='buttons'>
				<div className='row'>
					<div className='button special-operation' onClick={handleClear}>
						AC
					</div>
					<div className='button special-operation' onClick={handlePosNeg}>
						+/-
					</div>
					<div
						className={`button special-operation ${
							operator === '%' ? 'selected' : ''
						}`}
						onClick={handlePercentage}
					>
						%
					</div>
					<div
						className={`button ${operator === '/' ? 'selected' : ''}`}
						onClick={() => handleOperator('/')}
					>
						/
					</div>
				</div>
				<div className='row'>
					<div className='button number' onClick={() => handleNumber('7')}>
						7
					</div>
					<div className='button number' onClick={() => handleNumber('8')}>
						8
					</div>
					<div className='button number' onClick={() => handleNumber('9')}>
						9
					</div>
					<div
						className={`button ${operator === '*' ? 'selected' : ''}`}
						onClick={() => handleOperator('*')}
					>
						x
					</div>
				</div>
				<div className='row'>
					<div className='button number' onClick={() => handleNumber('4')}>
						4
					</div>
					<div className='button number' onClick={() => handleNumber('5')}>
						5
					</div>
					<div className='button number' onClick={() => handleNumber('6')}>
						6
					</div>
					<div
						className={`button ${operator === '-' ? 'selected' : ''}`}
						onClick={() => handleOperator('-')}
					>
						-
					</div>
				</div>
				<div className='row'>
					<div className='button number' onClick={() => handleNumber('1')}>
						1
					</div>
					<div className='button number' onClick={() => handleNumber('2')}>
						2
					</div>
					<div className='button number' onClick={() => handleNumber('3')}>
						3
					</div>
					<div
						className={`button ${operator === '+' ? 'selected' : ''}`}
						onClick={() => handleOperator('+')}
					>
						+
					</div>
				</div>
				<div className='special-row'>
					<div className='special-container'>
						<div
							className='button number double-button'
							onClick={() => handleNumber('0')}
						>
							0
						</div>
					</div>
					<div className='special-container'>
						<div className='button number' onClick={handleDecimal}>
							.
						</div>
						<div className='button' onClick={() => handleResult()}>
							=
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Calculator;
