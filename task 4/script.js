(() => {
  const ROWS = 6;
  const COLS = 7;

  const boardEl = document.getElementById('board');
  const hopperEl = document.getElementById('hopper');
  const statusEl = document.getElementById('status-message');
  const turnEl = document.getElementById('turn-indicator');
  const resetBtn = document.getElementById('reset-btn');
  const scoreRedEl = document.getElementById('score-red');
  const scoreYellowEl = document.getElementById('score-yellow');
  const cardRed = document.getElementById('card-red');
  const cardYellow = document.getElementById('card-yellow');

  let grid = [];
  let current = 'red';
  let gameOver = false;
  let scores = { red: 0, yellow: 0 };

  const cellEls = [];
  const previewChips = [];

  function buildBoard() {
    boardEl.innerHTML = '';
    hopperEl.innerHTML = '';
    cellEls.length = 0;
    previewChips.length = 0;
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

    for (let c = 0; c < COLS; c++) {
      const preview = document.createElement('div');
      preview.className = 'preview-chip';
      preview.style.left = `${(c + 0.5) * (100 / COLS)}%`;
      hopperEl.appendChild(preview);
      previewChips.push(preview);
    }

    for (let r = 0; r < ROWS; r++) {
      cellEls.push([]);
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        const piece = document.createElement('div');
        piece.className = 'chip-piece';
        cell.appendChild(piece);

        cell.addEventListener('click', () => handleColumnClick(c));
        cell.addEventListener('mouseenter', () => showPreview(c));
        cell.addEventListener('mouseleave', () => hidePreview(c));

        boardEl.appendChild(cell);
        cellEls[r].push(cell);
      }
    }
  }

  function showPreview(col) {
    if (gameOver) return;
    const row = lowestEmptyRow(col);
    if (row === -1) return;
    const chip = previewChips[col];
    chip.classList.add(current);
    chip.style.opacity = '0.55';
  }

  function hidePreview(col) {
    const chip = previewChips[col];
    chip.style.opacity = '0';
    chip.classList.remove('red', 'yellow');
  }

  function lowestEmptyRow(col) {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!grid[r][col]) return r;
    }
    return -1;
  }

  function handleColumnClick(col) {
    if (gameOver) return;
    const row = lowestEmptyRow(col);
    if (row === -1) {
      statusEl.textContent = 'That column is full — try another.';
      return;
    }

    grid[row][col] = current;
    hidePreview(col);

    const cell = cellEls[row][col];
    cell.classList.add('filled');
    const piece = cell.querySelector('.chip-piece');
    piece.classList.add(current);

    const winLine = checkWin(row, col);
    if (winLine) {
      gameOver = true;
      winLine.forEach(([wr, wc]) => {
        cellEls[wr][wc].querySelector('.chip-piece').classList.add('win');
      });
      scores[current] += 1;
      updateScores();
      statusEl.textContent = `${capitalize(current)} connects four! Round to ${capitalize(current)}.`;
      turnEl.textContent = '—';
      setActiveCard(null);
      return;
    }

    if (isBoardFull()) {
      gameOver = true;
      statusEl.textContent = "It's a draw — the board is full.";
      turnEl.textContent = '—';
      setActiveCard(null);
      return;
    }

    current = current === 'red' ? 'yellow' : 'red';
    statusEl.textContent = `${capitalize(current)}'s turn.`;
    turnEl.textContent = capitalize(current);
    setActiveCard(current);
  }

  function isBoardFull() {
    return grid[0].every(cell => cell !== null);
  }

  function checkWin(row, col) {
    const player = grid[row][col];
    const directions = [
      [[0, 1], [0, -1]],
      [[1, 0], [-1, 0]],
      [[1, 1], [-1, -1]],
      [[1, -1], [-1, 1]],
    ];

    for (const pair of directions) {
      let line = [[row, col]];
      for (const [dr, dc] of pair) {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && grid[r][c] === player) {
          line.push([r, c]);
          r += dr;
          c += dc;
        }
      }
      if (line.length >= 4) return line;
    }
    return null;
  }

  function updateScores() {
    scoreRedEl.textContent = scores.red;
    scoreYellowEl.textContent = scores.yellow;
  }

  function setActiveCard(player) {
    cardRed.classList.toggle('active', player === 'red');
    cardYellow.classList.toggle('active', player === 'yellow');
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function newRound() {
    gameOver = false;
    current = 'red';
    buildBoard();
    statusEl.textContent = "Red's turn.";
    turnEl.textContent = 'Red';
    setActiveCard('red');
  }

  resetBtn.addEventListener('click', newRound);

  newRound();
})();