const display = document.getElementById('display');
let expression = '';

function updateDisplay() {
  display.textContent = expression === '' ? '0' : expression;
}

function appendValue(value) {
  const operators = ['+', '-', '*', '/', '%'];
  const lastChar = expression.slice(-1);

  if (operators.includes(value) && operators.includes(lastChar)) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }
  updateDisplay();
}

function clearDisplay() {
  expression = '';
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    let evalExpression = expression.replace(/%/g, '/100');
    let result = Function('"use strict"; return (' + evalExpression + ')')();

    if (result === undefined || isNaN(result) || !isFinite(result)) {
      throw new Error('Invalid');
    }

    expression = String(result);
    updateDisplay();
  } catch (e) {
    display.textContent = 'Error';
    expression = '';
  }
}
document.addEventListener('keydown', function(e) {
  if ((e.key >= '0' && e.key <= '9') || ['+','-','*','/','.','%'].includes(e.key)) {
    appendValue(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
  } else if (e.key === 'Backspace') {
    deleteLast();
  } else if (e.key === 'Escape') {
    clearDisplay();
  }
});