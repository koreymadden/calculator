import { useState, useEffect } from 'react';

function Calculator() {
	const [currentDisplay, setCurrentDisplay] = useState('0');
	const [operator, setOperator] = useState(null);
	const [storedValue, setStoredValue] = useState(null);
	const [keyDown, setKeyDown] = useState(null);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (keyDown !== null) {
			routeKeyDown(keyDown);
		}
	}, [keyDown]);

	const routeKeyDown = (key) => {
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
				handleClear();
				break;

			default:
				break;
		}
	};

	const handleKeyDown = (e) => {
		setKeyDown(e.key);
	};

	const handleClear = () => {
		setCurrentDisplay('0');
		setOperator(null);
		setStoredValue(null);
	};

	const handleNumber = (numString) => {
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
			} else {
				setCurrentDisplay((oldValue) => oldValue + numString);
			}
		}
	};

	const handleOperator = (operatorVal) => {
		if (typeof storedValue !== 'string' && operator === operatorVal) {
			setOperator(null);
		} else if (typeof storedValue !== 'string') {
			setOperator(operatorVal);
		}
	};

	const handlePercentage = () => {
		setCurrentDisplay((oldValue) => (oldValue / 100).toString());
	};

	const handleDecimal = () => {
		if (typeof storedValue !== 'string' && operator) {
			setStoredValue(currentDisplay);
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

	const handleResult = () => {
		if (operator && currentDisplay && storedValue) {
			switch (operator) {
				case '+':
					setCurrentDisplay(
						(Number(storedValue) + Number(currentDisplay)).toString()
					);
					break;
				case '-':
					setCurrentDisplay(
						(Number(storedValue) - Number(currentDisplay)).toString()
					);
					break;
				case '*':
					setCurrentDisplay(
						(Number(storedValue) * Number(currentDisplay)).toString()
					);
					break;
				case '/':
					setCurrentDisplay(
						(Number(storedValue) / Number(currentDisplay)).toString()
					);
					break;

				default:
					break;
			}
			setStoredValue(null);
			setOperator(null);
		}
	};

	return (
		<div className='Calculator'>
			<div className='display'>{currentDisplay}</div>
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
							operator === '%' ? 'selected' : null
						}`}
						onClick={handlePercentage}
					>
						%
					</div>
					<div
						className={`button ${operator === '/' ? 'selected' : null}`}
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
						className={`button ${operator === '*' ? 'selected' : null}`}
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
						className={`button ${operator === '-' ? 'selected' : null}`}
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
						className={`button ${operator === '+' ? 'selected' : null}`}
						onClick={() => handleOperator('+')}
					>
						+
					</div>
				</div>
				<div className='row'>
					<div
						className='button number double-button'
						onClick={() => handleNumber('0')}
					>
						0
					</div>
					<div className='button number' onClick={handleDecimal}>
						.
					</div>
					<div className='button' onClick={handleResult}>
						=
					</div>
				</div>
			</div>
		</div>
	);
}

export default Calculator;
