const Button = (props) => {
    const { value, addMe, updateCalculator, id } = props;
    return ( 
        <div id={id} className={`button ${addMe}`} onClick={() => {if (updateCalculator) {updateCalculator(value)} }}>
            {value}
        </div>
     );
}
 
export default Button;