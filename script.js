// Função que carrega as configurações de tema do localStorage
function loadThemeSettings() {
  let persistTheme = localStorage.getItem("persistTheme");
  let autoCommemTheme = localStorage.getItem("autoCommemTheme");
  if (persistTheme === null) {
    persistTheme = "true";
    localStorage.setItem("persistTheme", "true");
  }
  if (autoCommemTheme === null) {
    autoCommemTheme = "true";
    localStorage.setItem("autoCommemTheme", "true");
  }
  return {
    persistTheme: persistTheme === "true",
    autoCommemTheme: autoCommemTheme === "true"
  };
}

// Atualiza o ícone do botão de tema de acordo com o tema atual
function updateThemeButton(themeName) {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (!themeName) {
    themeName = localStorage.getItem("selectedTheme") || "theme-light";
  }
  if (themeName === "theme-light") {
    themeToggleBtn.textContent = "☀️";
  } else if (themeName === "theme-dark") {
    themeToggleBtn.textContent = "🌙";
  } else if (themeName === "theme-space") {
    themeToggleBtn.textContent = "🌌";
  } else if (themeName === "theme-math") {
    themeToggleBtn.textContent = "➕";
  }
}

// Função que aplica o tema de acordo com a data e as configurações do usuário.
// Modificada: se estivermos no período comemorativo (26/05 a 31/05) e
// se a opção de auto tema estiver ativada, o tema será definido para "theme-math"
// (e o armazenamento também será atualizado). Fora desse período, se a persistência estiver ativa,
// usa o tema previamente escolhido; senão, usa "theme-light".
function setThemeBasedOnDate() {
  const settings = loadThemeSettings();
  let themeToApply;
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1; // Janeiro = 1, Maio = 5
  
  // Se estivermos entre 26 e 31 de maio e se a opção de temas comemorativos estiver ativa:
  if (settings.autoCommemTheme && month === 6 && day >= 1 && day <= 30) {
    themeToApply = "theme-math";
    // Atualiza o armazenamento, forçando o tema para o período comemorativo.
    localStorage.setItem("selectedTheme", "theme-math");
    console.log("Período comemorativo ativo: tema 'theme-math' selecionado automaticamente.");
  } else {
    // Fora do período comemorativo:
    if (settings.persistTheme) {
      themeToApply = localStorage.getItem("selectedTheme") || "theme-light";
    } else {
      themeToApply = "theme-light";
    }
    console.log("Tema aplicado conforme configuração: " + themeToApply);
  }
  // Atualiza as classes do body com o tema escolhido
  document.body.classList.remove("theme-light", "theme-dark", "theme-space", "theme-math");
  document.body.classList.add(themeToApply);
  updateThemeButton(themeToApply);
}

// Função para abrir o menu de configurações (modal) para alterar as opções de tema
function openConfigModal() {
  const modalOverlay = document.createElement("div");
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = 0;
  modalOverlay.style.left = 0;
  modalOverlay.style.width = "100%";
  modalOverlay.style.height = "100%";
  modalOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  modalOverlay.style.display = "flex";
  modalOverlay.style.justifyContent = "center";
  modalOverlay.style.alignItems = "center";
  modalOverlay.style.zIndex = 1000;
  
  const modal = document.createElement("div");
  modal.style.background = "#fff";
  modal.style.padding = "20px";
  modal.style.borderRadius = "8px";
  modal.style.textAlign = "center";
  modal.style.color = "#000000"
  modal.innerHTML = "<h3>Configurações de Tema</h3>";
  
  const settings = loadThemeSettings();
  
  // Checkbox para persistência do tema
  const persistCheckbox = document.createElement("input");
  persistCheckbox.type = "checkbox";
  persistCheckbox.checked = settings.persistTheme;
  const persistLabel = document.createElement("label");
  persistLabel.textContent = "Persistência do tema";
  persistLabel.style.marginLeft = "8px";
  
  // Checkbox para ativar temas comemorativos
  const autoCheckbox = document.createElement("input");
  autoCheckbox.type = "checkbox";
  autoCheckbox.checked = settings.autoCommemTheme;
  const autoLabel = document.createElement("label");
  autoLabel.textContent = "Ativar temas de data comemorativa";
  autoLabel.style.marginLeft = "8px";
  
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Salvar";
  saveBtn.style.marginTop = "10px";
  
  modal.appendChild(persistCheckbox);
  modal.appendChild(persistLabel);
  modal.appendChild(document.createElement("br"));
  modal.appendChild(autoCheckbox);
  modal.appendChild(autoLabel);
  modal.appendChild(document.createElement("br"));
  modal.appendChild(saveBtn);
  
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);
  
  saveBtn.addEventListener("click", function(){
    localStorage.setItem("persistTheme", persistCheckbox.checked ? "true" : "false");
    localStorage.setItem("autoCommemTheme", autoCheckbox.checked ? "true" : "false");
    document.body.removeChild(modalOverlay);
    setThemeBasedOnDate();
  });
}

// ===========================
// Inicialização e lógica de tema
// ===========================
document.addEventListener("DOMContentLoaded", function () {
  const themes = ["theme-light", "theme-dark", "theme-space", "theme-math"];
  let currentThemeIndex = 0;
  const themeToggleBtn = document.getElementById("theme-toggle-btn");

  // Aplica o tema armazenado ou o padrão, em conjunto com a verificação de data.
  let storedTheme = localStorage.getItem("selectedTheme");
  if (storedTheme && themes.includes(storedTheme)) {
    currentThemeIndex = themes.indexOf(storedTheme);
    document.body.className = storedTheme;
  } else {
    storedTheme = themes[0];
    document.body.className = storedTheme;
    localStorage.setItem("selectedTheme", storedTheme);
  }
  updateThemeButton();

  // Chama a função para aplicar o tema conforme a data e configuração.
  setThemeBasedOnDate();
  // Se a página permanecer aberta, atualiza a cada minuto.
  setInterval(setThemeBasedOnDate, 60 * 1000);

  // Listener do botão de alternar tema.
  themeToggleBtn.addEventListener("click", function () {
    const settings = loadThemeSettings();
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    // Se o modo comemorativo estiver ativo no período (26/05 a 31/05) e a opção estiver ligada, impede alterações manuais.
    if (settings.autoCommemTheme && month === 6 && day >= 1 && day <= 30) {
      alert("O tema comemorativo está ativo! Para alterar o tema, desative a opção 'Ativar temas de data comemorativa' nas configurações.");
      return;
    }
    const themesList = ["theme-light", "theme-dark", "theme-space", "theme-math"];
    let current = localStorage.getItem("selectedTheme") || "theme-light";
    let idx = themesList.indexOf(current);
    idx = (idx + 1) % themesList.length;
    const newTheme = themesList[idx];
    if (settings.persistTheme) {
      localStorage.setItem("selectedTheme", newTheme);
    }
    document.body.classList.remove(...themesList);
    document.body.classList.add(newTheme);
    updateThemeButton(newTheme);
  });

  // Configura o botão de configurações (se houver, por exemplo, com id "config-btn")
  const configBtn = document.getElementById("config-btn");
  if (configBtn) {
    configBtn.addEventListener("click", openConfigModal);
  }

  /* === Carregamento dos Conteúdos Públicos === */
  const jsonUrl = "./conteudos.json";
  function loadPublicData() {
    fetch(jsonUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao carregar o arquivo JSON");
        }
        return response.json();
      })
      .then(data => {
        renderPublicContent(data.subjects, data.installerFile);
      })
      .catch(error => {
        console.error("Erro:", error);
        document.getElementById("public-content").innerHTML =
          "<p>Erro ao carregar os conteúdos. Tente novamente mais tarde.</p>";
      });
  }

  function renderPublicContent(data) {
    const container = document.getElementById("public-content");
    container.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p>Nenhum conteúdo disponível.</p>";
      return;
    }
    data.forEach(subject => {
      const card = document.createElement("div");
      card.classList.add("card");

      const subjectTitle = document.createElement("h2");
      subjectTitle.textContent = subject.name;
      if (subject.color) subjectTitle.style.color = subject.color;
      card.appendChild(subjectTitle);

      if (!subject.contents || subject.contents.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Nada por aqui...";
        card.appendChild(emptyMsg);
      } else {
        subject.contents.forEach((content, index) => {
          const contentItem = document.createElement("div");
          contentItem.classList.add("content-item");

          const toggleBtn = document.createElement("button");
          toggleBtn.classList.add("show-full-btn");
          toggleBtn.textContent = "conteúdo " + (index + 1);

          const contentDiv = document.createElement("div");
          contentDiv.classList.add("content-full");
          contentDiv.innerHTML = content.text;

          toggleBtn.addEventListener("click", function () {
            if (contentDiv.style.display === "block") {
              contentDiv.style.display = "none";
              toggleBtn.textContent = "conteúdo " + (index + 1);
            } else {
              contentDiv.style.display = "block";
              toggleBtn.textContent = "Ocultar conteúdo " + (index + 1);
            }
          });

          contentItem.appendChild(toggleBtn);
          contentItem.appendChild(contentDiv);
          card.appendChild(contentItem);
        });
      }
      container.appendChild(card);
    });
  }

  // Carrega os conteúdos públicos
  loadPublicData();
});

// Atualiza o ícone do tema com base no tema atual do localStorage
function updateThemeButton() {
  const storedTheme = localStorage.getItem("selectedTheme");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (storedTheme === "theme-light") {
    themeToggleBtn.textContent = "☀️";
  } else if (storedTheme === "theme-dark") {
    themeToggleBtn.textContent = "🌙";
  } else if (storedTheme === "theme-space") {
    themeToggleBtn.textContent = "🌌";
  } else if (storedTheme === "theme-math") {
    themeToggleBtn.textContent = "➕";
  }
}
