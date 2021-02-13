import { useEffect, useState } from 'react';
import './App.css';
import Button from "./components/Button";

function App() {

  const [ resultDisplay, setResultDisplay ] = useState(0);
  const [ currentOperator, setCurrentOperator ] = useState(null);
  const [ statementOne, setStatementOne ] = useState(null);
  const [ statementTwo, setStatementTwo ] = useState(null);
  const [ oldOperator, setOldOperator ] = useState(null);
  const [ oldStatementTwo, setOldStatementTwo ] = useState(null);
  const [ resultHex, setResultHex ] = useState(0x00);
  const [ resultChar, setResultChar ] = useState('');

  const updateCalculator = (value) => {
    if (resultDisplay === Infinity && value !== 'C') return
    switch (value) {
      case '%':
        setResultDisplay(display => eval(display / 100))
        break;
      case '+/-':
        if (statementTwo) setStatementTwo(oldValue => eval(oldValue * -1))
        setResultDisplay(display => eval(display * -1))
        break;
      case '/':
      case 'x':
      case '-':
      case '+':
        if (!currentOperator) {
          setCurrentOperator(value.indexOf('x') !== -1 ? '*' : value);
          setStatementOne(resultDisplay);
        } else if (currentOperator && statementOne !== null && statementTwo !== null) {
          console.debug('statementOne + currentOperator + statementTwo: ', statementOne + currentOperator + statementTwo);
          const result = eval(statementOne + currentOperator + statementTwo);
          setResultDisplay(result)
          setOldStatementTwo(statementTwo)
          setStatementTwo(null)
          setOldOperator(currentOperator);
          setCurrentOperator(value.indexOf('x') !== -1 ? '*' : value);
          setStatementOne(result)
        } else if (currentOperator) {
          setCurrentOperator(value.indexOf('x') !== -1 ? '*' : value);
        } else {
          console.error('case not supported')
        }
        break;
      case 'C':
        setResultDisplay(0)
        setStatementOne(null)
        setStatementTwo(null)
        setCurrentOperator(null)
        setOldOperator(null)
        setOldStatementTwo(null)
        break;
      case '=':
        if (statementOne !== null && statementTwo !== null && currentOperator) {
          console.debug('statementOne + currentOperator + statementTwo: ', statementOne + currentOperator + statementTwo);
          const result = eval(statementOne + currentOperator + statementTwo);
          setResultDisplay(result);
          setOldStatementTwo(statementTwo);
          setStatementTwo(null)
          setOldOperator(currentOperator);
          setCurrentOperator(null);
          setStatementOne(result)
        } else if (statementOne !== null && oldStatementTwo !== null && oldOperator) {
          console.debug('statementOne + oldOperator + oldStatementTwo: ', statementOne + oldOperator + oldStatementTwo);
          const result = eval(statementOne + oldOperator + oldStatementTwo);
          setResultDisplay(result)
          setStatementTwo(null)
          setStatementOne(result)
        }
        break;
      default:
        if (currentOperator && statementOne === null) {
          setStatementOne(resultDisplay)
          setResultDisplay(value)
          setCurrentOperator(null)
        } else if (currentOperator && statementOne !== null && statementTwo === null) {
          setResultDisplay(value)
          setStatementTwo(value)
        } else if (currentOperator && statementOne !== null && statementTwo !== null) {
          setStatementTwo((oldValue) => oldValue + value)
          setResultDisplay((oldValue) => oldValue + value)
        } else {
          setResultDisplay(oldValue => oldValue === 0 ? value : oldValue.toString() + value)
        }
        break;
    }
  }

  useEffect(() => {
    const activeOperator = document.getElementsByClassName('activeOperator');
    if (activeOperator.length !== 0) activeOperator[0].classList.remove('activeOperator');
    if (currentOperator && statementTwo === null) {
      document.getElementById(currentOperator).classList.add('activeOperator');
    }
  }, [currentOperator, statementOne, statementTwo])

  useEffect(() => {
    let allHexValues = [];
    let threeCharArrayHex = resultDisplay.toString().match(/.{1,3}/g);
    threeCharArrayHex.forEach(string => {
      let newNumber = Number(string).toString(16).toUpperCase();
      if (newNumber.length === 1) newNumber = 0 + newNumber
      allHexValues.push(newNumber)
    })
    allHexValues = allHexValues.join(' 0x')
    resultDisplay % 1 !== 0 ? setResultHex('') : setResultHex('0x' + allHexValues);

    let allCharValues = [];
    const threeCharArrayChar = resultDisplay.toString().match(/.{1,3}/g);
    threeCharArrayChar.forEach(string => {
      allCharValues.push(String.fromCharCode(string))
    })
    allCharValues = allCharValues.join('');
    setResultChar(allCharValues)
  }, [resultDisplay])

  function KeyPresser () {
    useEffect(() => {
      function onKeyup(e) {
          if ((e.keyCode > 47 && e.keyCode < 58) || e.key === '-' || e.key === '+' || e.key === '/' || e.key === '=') {
              updateCalculator(e.key)
          } else if (e.key === 'Escape' || e.key === 'Clear') {
              updateCalculator('C')
          } else if (e.key === '*') {
              updateCalculator('x')
          } else if (e.key === 'Enter') {
              updateCalculator('=')
          }
      }
      window.addEventListener('keyup', onKeyup);
      return () => window.removeEventListener('keyup', onKeyup);
    }, []);
    return null
  }

  return (
    <div className="App background-two">
      <KeyPresser />
      <section className="button-section">
        <div className="translation-area">
          <div className="translation-section" onClick={(e) => {navigator.clipboard.writeText(resultHex)}}>
            <div className="translation-section-top">Hexadecimal</div>
            <div className="translation-section-bottom">{resultHex}</div>
          </div>
          <div className="translation-section" onClick={(e) => {navigator.clipboard.writeText(resultChar)}}>
            <div className="translation-section-top">Character</div>
            <div className="translation-section-bottom">{resultChar}</div>
          </div>
        </div>
        <div className="result-area" onClick={(e) => {navigator.clipboard.writeText(resultDisplay)}}
>{resultDisplay}</div>
        <div className="break"></div>
        <Button value="C" addMe="background-three color-one" updateCalculator={updateCalculator}/>
        <Button value="+/-" addMe="background-three color-one" updateCalculator={updateCalculator} />
        <Button value="%" addMe="background-three color-one" updateCalculator={updateCalculator} />
        <Button value="/" addMe="background-four" updateCalculator={updateCalculator} id="/" />
        <div className="break"></div>
        <Button value="1" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="2" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="3" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="x" addMe="background-four" updateCalculator={updateCalculator} id="*" />
        <div className="break"></div>
        <Button value="4" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="5" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="6" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="-" addMe="background-four" updateCalculator={updateCalculator} id="-" />
        <div className="break"></div>
        <Button value="7" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="8" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="9" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="+" addMe="background-four" updateCalculator={updateCalculator} id="+" />
        <div className="break"></div>
        <Button value="0" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="0" addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="." addMe="background-one" updateCalculator={updateCalculator} />
        <Button value="=" addMe="background-four" updateCalculator={updateCalculator} />
      </section>
    </div>
  );
}

export default App;
