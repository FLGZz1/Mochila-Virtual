// ===========================
// script.js completo
// ===========================

// -------- Tema & Configurações --------

function loadThemeSettings() {
  let persistTheme    = localStorage.getItem("persistTheme");
  let autoCommemTheme = localStorage.getItem("autoCommemTheme");

  if (persistTheme    === null) {
    persistTheme = "true";
    localStorage.setItem("persistTheme", "true");
  }
  if (autoCommemTheme === null) {
    autoCommemTheme = "true";
    localStorage.setItem("autoCommemTheme", "true");
  }

  return {
    persistTheme:    persistTheme === "true",
    autoCommemTheme: autoCommemTheme === "true"
  };
}

function updateThemeButton(themeName) {
  const btn = document.getElementById("theme-toggle-btn");
  if (!themeName) {
    themeName = localStorage.getItem("selectedTheme") || "theme-light";
  }
  switch (themeName) {
    case "theme-light": btn.textContent = "☀️"; break;
    case "theme-dark":  btn.textContent = "🌙"; break;
    case "theme-space": btn.textContent = "🌌"; break;
    case "theme-math":  btn.textContent = "➕"; break;
  }
}

function setThemeBasedOnDate() {
  const { persistTheme, autoCommemTheme } = loadThemeSettings();
  const now   = new Date();
  const month = now.getMonth() + 1;
  let themeToApply;

  // Tema comemorativo: todo junho
  if (autoCommemTheme && month === 6) {
    themeToApply = "theme-math";
    localStorage.setItem("selectedTheme", themeToApply);
  } else {
    themeToApply = persistTheme
      ? (localStorage.getItem("selectedTheme") || "theme-light")
      : "theme-light";
  }

  document.body.classList.remove("theme-light","theme-dark","theme-space","theme-math");
  document.body.classList.add(themeToApply);
  updateThemeButton(themeToApply);
}

function openConfigModal() {
  const { persistTheme, autoCommemTheme } = loadThemeSettings();
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.5); display:flex;
    justify-content:center; align-items:center; z-index:1000;
  `;
  const modal = document.createElement("div");
  modal.style.cssText = `
    background:#fff; padding:20px; border-radius:8px;
    text-align:left; color:#000;
  `;
  modal.innerHTML = `<h3>Configurações de Tema</h3>`;

  const persistCheckbox = document.createElement("input");
  persistCheckbox.type    = "checkbox";
  persistCheckbox.checked = persistTheme;
  const persistLabel = document.createElement("label");
  persistLabel.textContent = " Persistir tema";

  const autoCheckbox = document.createElement("input");
  autoCheckbox.type    = "checkbox";
  autoCheckbox.checked = autoCommemTheme;
  const autoLabel = document.createElement("label");
  autoLabel.textContent = " Ativar tema comemorativo";

  const saveBtn = document.createElement("button");
  saveBtn.textContent    = "Salvar";
  saveBtn.style.marginTop = "12px";

  modal.append(
    persistCheckbox, persistLabel, document.createElement("br"),
    autoCheckbox, autoLabel,       document.createElement("br"),
    saveBtn
  );
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  saveBtn.addEventListener("click", () => {
    localStorage.setItem("persistTheme",    persistCheckbox.checked);
    localStorage.setItem("autoCommemTheme", autoCheckbox.checked);
    document.body.removeChild(overlay);
    setThemeBasedOnDate();
  });
}

// -------- Conteúdos & Bimestres por Card --------

let allSubjects = [];
const subjectBims = {}; // { subjectId: currentBimestre }

// Cria e retorna um cartão completo para uma matéria
function renderSubjectCard(subject) {
  const card = document.createElement("div");
  card.classList.add("card");

  // Título da matéria
  const title = document.createElement("h2");
  title.textContent = subject.name;
  if (subject.color) title.style.color = subject.color;
  card.appendChild(title);

  // Seletor de Bimestre (botões estilo tabs)
  const bimSelector = document.createElement("div");
  bimSelector.classList.add("bim-selector");
  [1,2,3,4].forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = `${b}º Bimestre`;
    btn.dataset.bim = b;
    btn.classList.add("bim-btn");
    bimSelector.appendChild(btn);
  });
  card.appendChild(bimSelector);

  // Container para conteúdos filtrados
  const contentsContainer = document.createElement("div");
  contentsContainer.classList.add("subject-contents");
  card.appendChild(contentsContainer);

  // Função que popula conteúdos de acordo com bimestre e agrupa por aula
  function populate() {
    const selBim = subjectBims[subject.id] || 1;

    // Atualiza estado ativo dos botões de bimestre
    Array.from(bimSelector.children).forEach(btn => {
      btn.classList.toggle("active", Number(btn.dataset.bim) === selBim);
    });

    // Filtra por bimestre
    const lista = (subject.contents || [])
      .filter(c => c.bimestre === selBim);

    contentsContainer.innerHTML = "";
    if (!lista.length) {
      const p = document.createElement("p");
      p.textContent = "Nenhum conteúdo neste bimestre.";
      contentsContainer.appendChild(p);
      return;
    }

    // Agrupa por lessonNumber e utiliza lessonTitle
    const aulas = {};
    lista.forEach(c => {
      const num   = c.lessonNumber;
      const title = c.lessonTitle || `Aula ${num}`;
      if (!aulas[num]) aulas[num] = { title, items: [] };
      aulas[num].items.push(c);
    });

    // Renderiza cada aula em ordem numérica
    Object.keys(aulas)
      .sort((a,b) => a - b)
      .forEach(num => {
        const bloco = aulas[num];

        // Cabeçalho de aula
        const h4 = document.createElement("h4");
        h4.classList.add("lesson-header");
        h4.textContent = `Aula ${num}: ${bloco.title}`;
        contentsContainer.appendChild(h4);

        // Itens dessa aula
        bloco.items.forEach((c, i) => {
          const item = document.createElement("div");
          item.classList.add("content-item");

          const btn = document.createElement("button");
          btn.classList.add("show-full-btn");
          btn.textContent = c.title || `Conteúdo ${i+1}`;

          const full = document.createElement("div");
          full.classList.add("content-full");
          full.style.display = "none";
          full.innerHTML = c.text;

          btn.addEventListener("click", () => {
            const open = full.style.display === "block";
            full.style.display = open ? "none" : "block";
            btn.textContent = open
              ? (c.title || `Conteúdo ${i+1}`)
              : `Ocultar: ${c.title || `Conteúdo ${i+1}`}`;
          });

          item.append(btn, full);
          contentsContainer.appendChild(item);
        });
      });
  }

  // Monitora clique nos botões de bimestre
  bimSelector.addEventListener("click", e => {
    if (e.target.matches(".bim-btn")) {
      subjectBims[subject.id] = Number(e.target.dataset.bim);
      populate();
    }
  });

  // Inicializa com bimestre 1 (ou valor salvo)
  subjectBims[subject.id] = subjectBims[subject.id] || 1;
  populate();

  return card;
}

// Renderiza todos os cards de matérias
function renderPublicContent(subjects) {
  const container = document.getElementById("public-content");
  container.innerHTML = "";
  if (!Array.isArray(subjects) || !subjects.length) {
    container.innerHTML = "<p>Nenhum conteúdo disponível.</p>";
    return;
  }
  subjects.forEach(subj => {
    const card = renderSubjectCard(subj);
    container.appendChild(card);
  });
}

// -------- Inicialização --------

document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");

  // Aplica tema no carregamento e a cada minuto
  setThemeBasedOnDate();
  setInterval(setThemeBasedOnDate, 60 * 1000);

  // Alterna tema manualmente
  themeToggleBtn.addEventListener("click", () => {
    const { persistTheme, autoCommemTheme } = loadThemeSettings();
    const now   = new Date();
    const month = now.getMonth() + 1;

    if (autoCommemTheme && month === 6) {
      alert("Tema comemorativo ativo. Desative em Configurações para mudar.");
      return;
    }

    const themes = ["theme-light","theme-dark","theme-space","theme-math"];
    let cur = localStorage.getItem("selectedTheme") || themes[0];
    let idx = (themes.indexOf(cur) + 1) % themes.length;
    const next = themes[idx];

    if (persistTheme) {
      localStorage.setItem("selectedTheme", next);
    }
    document.body.classList.remove(...themes);
    document.body.classList.add(next);
    updateThemeButton(next);
  });

  // Botão de configurações
  document.getElementById("config-btn")
    .addEventListener("click", openConfigModal);

  // Carrega JSON e renderiza
  fetch("./conteudos.json")
    .then(resp => {
      if (!resp.ok) throw new Error("Falha ao carregar JSON");
      return resp.json();
    })
    .then(data => {
      allSubjects = data.subjects || [];
      renderPublicContent(allSubjects);
    })
    .catch(err => {
      console.error(err);
      document.getElementById("public-content")
        .innerHTML = "<p>Erro ao carregar conteúdos.</p>";
    });
});