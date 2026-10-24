// ============================================================
// LEDGER — to-do list logic
// State lives in memory for this session (no browser storage).
// ============================================================

(function(){
  "use strict";

  /** @type {{id:number, text:string, priority:'low'|'normal'|'high', done:boolean}[]} */
  let tasks = [];
  let nextId = 1;
  let activeFilter = "all"; // all | open | done

  const els = {
    form: document.getElementById("entry-form"),
    input: document.getElementById("task-input"),
    prioritySelect: document.getElementById("priority-select"),
    nextIndex: document.getElementById("next-index"),
    list: document.getElementById("ledger-list"),
    empty: document.getElementById("empty-state"),
    tallyText: document.getElementById("tally-text"),
    tallyFill: document.getElementById("tally-fill"),
    clearDone: document.getElementById("clear-done"),
    filterBtns: Array.from(document.querySelectorAll(".filter-btn")),
    themeBtns: Array.from(document.querySelectorAll(".theme-btn")),
  };

  function pad(n){ return String(n).padStart(2, "0"); }

  function updateNextIndex(){
    els.nextIndex.textContent = pad(tasks.length + 1);
  }

  function visibleTasks(){
    if (activeFilter === "open") return tasks.filter(t => !t.done);
    if (activeFilter === "done") return tasks.filter(t => t.done);
    return tasks;
  }

  function render(){
    const visible = visibleTasks();
    els.list.innerHTML = "";

    visible.forEach((task, i) => {
      const li = document.createElement("li");
      li.className = "ledger-row" + (task.done ? " is-done" : "");
      li.dataset.id = String(task.id);

      li.innerHTML = `
        <span class="row-index">${pad(i + 1)}</span>
        <input type="checkbox" class="row-check" ${task.done ? "checked" : ""} aria-label="Mark done">
        <div class="row-body">
          <span class="row-text"></span>
          <div class="row-meta">
            <span class="priority-tag" data-priority="${task.priority}">${task.priority}</span>
          </div>
        </div>
        <button class="row-del" title="Delete" aria-label="Delete task">✕</button>
      `;

      // set text via textContent to avoid any HTML injection
      li.querySelector(".row-text").textContent = task.text;

      els.list.appendChild(li);
    });

    els.empty.classList.toggle("is-visible", tasks.length === 0);

    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    els.tallyText.textContent = `${total} ${total === 1 ? "entry" : "entries"} · ${done} closed`;
    els.tallyFill.style.width = total ? `${Math.round((done / total) * 100)}%` : "0%";

    updateNextIndex();
  }

  function addTask(text, priority){
    const trimmed = text.trim();
    if (!trimmed) return;
    tasks.push({ id: nextId++, text: trimmed, priority, done: false });
    render();
  }

  function toggleTask(id){
    const task = tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
    render();
  }

  function deleteTask(id, rowEl){
    if (rowEl){
      rowEl.classList.add("is-leaving");
      rowEl.addEventListener("animationend", () => {
        tasks = tasks.filter(t => t.id !== id);
        render();
      }, { once: true });
    } else {
      tasks = tasks.filter(t => t.id !== id);
      render();
    }
  }

  function clearDone(){
    tasks = tasks.filter(t => !t.done);
    render();
  }

  // ---- Events ----

  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask(els.input.value, els.prioritySelect.value);
    els.input.value = "";
    els.input.focus();
  });

  els.list.addEventListener("click", (e) => {
    const row = e.target.closest(".ledger-row");
    if (!row) return;
    const id = Number(row.dataset.id);

    if (e.target.classList.contains("row-check")){
      toggleTask(id);
    } else if (e.target.classList.contains("row-del")){
      deleteTask(id, row);
    }
  });

  els.clearDone.addEventListener("click", clearDone);

  els.filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      els.filterBtns.forEach(b => b.classList.toggle("is-active", b === btn));
      render();
    });
  });

  // ---- Theme switching ----
  els.themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.themeBtn;
      document.documentElement.setAttribute("data-theme", theme);
      els.themeBtns.forEach(b => b.setAttribute("aria-selected", String(b === btn)));
    });
  });

  // ---- Seed a couple of example rows so the ledger isn't empty on load ----
  addTask("Draft the placement resume outline", "high");
  addTask("Revise a graph traversal problem", "normal");
  render();

})();
