import { useEffect } from 'react';

export default function useKeypress(key, action, calculator) {
  useEffect(() => {
    function onKeyup(e) {
        if (e.key === key && action) {
            action()
        } else if ((e.keyCode > 47 && e.keyCode < 58) || e.key === '-' || e.key === '+' || e.key === '/' || e.key === '=') {
            calculator(e.key)
        } else if (e.key === 'Escape' || e.key === 'Clear') {
            calculator('C')
        } else if (e.key === '*') {
            calculator('x')
        } else if (e.key === 'Enter') {
            calculator('=')
        }
    }
    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  }, []);
}
