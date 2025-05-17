document.addEventListener("DOMContentLoaded", function () {
  /* === Dados de Conteúdo === */
  const jsonUrl = "./conteudos.json";
  
  // Dados padrão, caso fetch falhe
  const defaultData = {
    "subjects": [
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
    ],
    "installerFile": null
  };

  // Função que carrega os dados do JSON
  function loadPublicData() {
    fetch(jsonUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao carregar o arquivo JSON");
        }
        return response.json();
      })
      .then(data => {
        // data deve ser um objeto com as propriedades `subjects` e `installerFile`
        renderPublicContent(data.subjects, data.installerFile);
      })
      .catch(error => {
        console.error("Erro:", error);
        document.getElementById("public-content").innerHTML =
          "<p>Erro ao carregar os conteúdos. Tente novamente mais tarde.</p>";
      });
  }

  // Função que renderiza os conteúdos na página
  function renderPublicContent(subjects, installerFile) {
    const container = document.getElementById("public-content");
    container.innerHTML = "";

    // Verifica se há matérias
    if (!subjects || subjects.length === 0) {
      container.innerHTML = "<p>Nenhum conteúdo disponível.</p>";
      return;
    }

    // Itera sobre as matérias e renderiza-as
    subjects.forEach(subject => {
      const card = document.createElement("div");
      card.classList.add("card");

      // Cria o título da matéria
      const subjectTitle = document.createElement("h2");
      subjectTitle.textContent = subject.name;
      if (subject.color) {
        subjectTitle.style.color = subject.color;
      }
      card.appendChild(subjectTitle);

      // Renderiza os conteúdos da matéria
      if (!subject.contents || subject.contents.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Nada por aqui...";
        card.appendChild(emptyMsg);
      } else {
        subject.contents.forEach((content, index) => {
          const contentItem = document.createElement("div");
          contentItem.classList.add("content-item");

          // Cria um botão para alternar a exibição do conteúdo
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

    // Se houver um instalador, cria e adiciona o botão de download
    if (installerFile) {
      const installerDiv = document.createElement("div");
      installerDiv.classList.add("installer-download");
      installerDiv.style.textAlign = "center";
      installerDiv.style.marginTop = "20px";

      const downloadLink = document.createElement("a");
      downloadLink.href = installerFile.data; // Data URL do arquivo
      downloadLink.download = installerFile.fileName;
      downloadLink.textContent = "Baixar Instalador";
      downloadLink.classList.add("download-link");

      installerDiv.appendChild(downloadLink);
      container.appendChild(installerDiv);
    }
  }

  /* === Carrega os dados automaticamente === */
  loadPublicData();

  /* === Lógica de Tema com Botão Único e Persistência === */
  const themes = ["theme-light", "theme-dark", "theme-space"];
  let currentThemeIndex = 0;
  const themeToggleBtn = document.getElementById("theme-toggle-btn");

  // Verifica se há um tema armazenado no localStorage
  const storedTheme = localStorage.getItem("selectedTheme");
  if (storedTheme && themes.includes(storedTheme)) {
    currentThemeIndex = themes.indexOf(storedTheme);
    document.body.className = storedTheme;
  } else {
    document.body.className = themes[0];
    localStorage.setItem("selectedTheme", themes[0]);
  }
  updateThemeButton();

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

  themeToggleBtn.addEventListener("click", function () {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    document.body.className = newTheme;
    updateThemeButton();
    localStorage.setItem("selectedTheme", newTheme);
  });
});