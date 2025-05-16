document.addEventListener("DOMContentLoaded", function () {
  // Botão do menu para visualizar conteúdos
  const viewContentsBtn = document.getElementById("view-contents-btn");
  const contentsSection = document.getElementById("contents-section");
  
  // Arquivo JSON fixo (na mesma pasta)
  const jsonUrl = "./conteudos.json";

  viewContentsBtn.addEventListener("click", function() {
    // Exibe a seção dos conteúdos e carrega o JSON
    contentsSection.classList.remove("hidden");
    loadPublicData();
  });

  // Função para carregar os dados do arquivo JSON
  function loadPublicData() {
    fetch(jsonUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao carregar o arquivo JSON");
        }
        return response.json();
      })
      .then(data => {
        renderPublicContent(data);
      })
      .catch(error => {
        console.error("Erro:", error);
        document.getElementById("public-content").innerHTML =
          "<p>Erro ao carregar os conteúdos. Tente novamente mais tarde.</p>";
      });
  }

  // Função para renderizar os conteúdos de forma dinâmica e organizada
  function renderPublicContent(data) {
    const container = document.getElementById("public-content");
    container.innerHTML = "";

    // Verifica se há dados válidos
    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p>Nenhum conteúdo disponível.</p>";
      return;
    }

    data.forEach(subject => {
      // Cria o cartão para cada matéria
      const card = document.createElement("div");
      card.classList.add("card");

      // Título da matéria com a cor definida (se houver)
      const subjectTitle = document.createElement("h2");
      subjectTitle.textContent = subject.name;
      if (subject.color) {
        subjectTitle.style.color = subject.color;
      }
      card.appendChild(subjectTitle);

      // Container para os conteúdos da matéria
      const contentsContainer = document.createElement("div");
      contentsContainer.classList.add("contents");

      if (subject.contents && subject.contents.length > 0) {
        subject.contents.forEach(content => {
          const contentItem = document.createElement("div");
          contentItem.classList.add("content-item");

          // Pré-visualização: usa innerHTML para preservar formatações
          const previewDiv = document.createElement("div");
          previewDiv.classList.add("content-preview");
          previewDiv.innerHTML = content.text;
          
          // Conteúdo completo, inicialmente oculto
          const fullDiv = document.createElement("div");
          fullDiv.classList.add("content-full");
          fullDiv.innerHTML = content.text;

          // Botão para alternar a exibição completa
          const toggleBtn = document.createElement("button");
          toggleBtn.classList.add("show-full-btn");
          toggleBtn.textContent = "Mostrar conteúdo completo";
          toggleBtn.addEventListener("click", function() {
            if (fullDiv.classList.contains("visible")) {
              fullDiv.classList.remove("visible");
              toggleBtn.textContent = "Mostrar conteúdo completo";
            } else {
              fullDiv.classList.add("visible");
              toggleBtn.textContent = "Ocultar conteúdo";
            }
          });

          contentItem.appendChild(previewDiv);
          contentItem.appendChild(toggleBtn);
          contentItem.appendChild(fullDiv);
          
          contentsContainer.appendChild(contentItem);
        });
      } else {
        const noContentMsg = document.createElement("p");
        noContentMsg.textContent = "Nenhum conteúdo adicionado para essa matéria.";
        contentsContainer.appendChild(noContentMsg);
      }

      card.appendChild(contentsContainer);
      container.appendChild(card);
    });
  }
});
