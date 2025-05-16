document.addEventListener("DOMContentLoaded", function () {
  /* ===== Dados Pré-carregados ===== */
  const jsonUrl = "./conteudos.json";
  const defaultData = [
    {
      "name": "Matéria 1",
      "color": "#007BFF",
      "contents": [
        { "text": "<p>Este é o conteúdo 1 da Matéria 1.</p>" },
        { "text": "<p>Este é o conteúdo 2 da Matéria 1.</p>" }
      ]
    },
    {
      "name": "Matéria 2",
      "color": "#FF0000",
      "contents": []
    },
    {
      "name": "Matéria 3",
      "color": "#8A2BE2",
      "contents": [
        { "text": "<p>Este é o único conteúdo da Matéria 3.</p>" }
      ]
    }
  ];

  /* ===== Funções para Carregamento e Renderização dos Conteúdos ===== */
  function loadPublicData() {
    fetch(jsonUrl)
      .then(response => {
        if (!response.ok) throw new Error("Erro ao carregar o arquivo JSON");
        return response.json();
      })
      .then(data => {
        renderPublicContent(data);
      })
      .catch(error => {
        console.error("Erro:", error, "Utilizando dados padrão.");
        renderPublicContent(defaultData);
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

  /* ===== Lógica de Tema com Persistência ===== */
  // Temas disponíveis: light, dark, space (ordem cíclica)
  const themes = ["theme-light", "theme-dark", "theme-space"];
  let currentThemeIndex = 0;

  // Obter a referência para o botão de tema (único)
  const themeToggleBtn = document.getElementById("theme-toggle-btn");

  // Ao iniciar, verificar se já há um tema salvo
  const storedTheme = localStorage.getItem("selectedTheme");
  if (storedTheme && themes.includes(storedTheme)) {
    currentThemeIndex = themes.indexOf(storedTheme);
    document.body.className = storedTheme;
  } else {
    // Caso contrário, define o padrão (theme-light) e salva
    document.body.className = themes[0];
    localStorage.setItem("selectedTheme", themes[0]);
  }

  // Função para atualizar o emoji do botão conforme o tema atual
  function updateThemeButton() {
    const currentTheme = themes[currentThemeIndex];
    if (currentTheme === "theme-light") {
      themeToggleBtn.textContent = "☀️";
    } else if (currentTheme === "theme-dark") {
      themeToggleBtn.textContent = "🌙";
    } else if (currentTheme === "theme-space") {
      themeToggleBtn.textContent = "🌌";
    }
  }
  updateThemeButton();

  // Ao clicar, alterna para o próximo tema, atualiza o body e salva a escolha
  themeToggleBtn.addEventListener("click", function () {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    document.body.className = newTheme;
    updateThemeButton();
    localStorage.setItem("selectedTheme", newTheme);
  });

  /* ===== Inicializa o Carregamento dos Conteúdos ===== */
  loadPublicData();
});
