document.addEventListener("DOMContentLoaded", function() {
  // Estado dos dados
  let subjects = [];
  let currentSubjectId = null;
  let currentContentId = null;
  const PASSWORD = "1tecno@2024";

  // Elementos da Landing
  const landing = document.getElementById("landing");
  const viewBtn = document.getElementById("view-btn");
  const editBtn = document.getElementById("edit-btn");

  // Seções para Editor e Visualização
  const editorSection = document.getElementById("editor-section");
  const viewSection = document.getElementById("view-section");
  const backToLandingBtn = document.getElementById("back-to-landing");

  // Elementos do Editor – Matérias
  const addSubjectForm = document.getElementById("add-subject-form");
  const subjectNameInput = document.getElementById("subject-name");
  const subjectColorInput = document.getElementById("subject-color");
  const subjectsList = document.getElementById("subjects-list");

  // Elementos para detalhes da Matéria (lista de conteúdos)
  const subjectDetailSection = document.getElementById("subject-detail");
  const backToSubjectsBtn = document.getElementById("back-to-subjects");
  const subjectTitle = document.getElementById("subject-title");
  const editSubjectBtn = document.getElementById("edit-subject");
  const deleteSubjectBtn = document.getElementById("delete-subject");
  const subjectEditDiv = document.getElementById("subject-edit");
  const editSubjectNameInput = document.getElementById("edit-subject-name");
  const editSubjectColorInput = document.getElementById("edit-subject-color");
  const saveSubjectBtn = document.getElementById("save-subject");
  const cancelEditBtn = document.getElementById("cancel-edit");

  // Elementos de Conteúdo
  const newContentBtn = document.getElementById("new-content-btn");
  const contentsList = document.getElementById("contents-list");

  // Elementos do Editor de Conteúdo
  const contentDetailSection = document.getElementById("content-detail");
  const backToContentsBtn = document.getElementById("back-to-contents");
  const contentDisplay = document.getElementById("content-display");
  const contentEditText = document.getElementById("content-edit-text");
  const editContentBtn = document.getElementById("edit-content-btn");
  const saveContentBtn = document.getElementById("save-content-btn");
  const cancelContentEditBtn = document.getElementById("cancel-content-edit-btn");
  const toolbarButtons = document.querySelectorAll("#editor-toolbar button");
  const textColorInput = document.getElementById("text-color-input");
  const highlightColorInput = document.getElementById("highlight-color-input");
  const editorBgColorInput = document.getElementById("editor-bg-color");
  const imageInput = document.getElementById("image-input");

  // Elementos do modo Público (read‑only)
  const publicContentDiv = document.getElementById("public-content");

  // Função para salvar os dados no localStorage
  function saveData() {
    localStorage.setItem("mochilaData", JSON.stringify(subjects));
  }

  // Função para carregar os dados do localStorage
  function loadData() {
    const data = localStorage.getItem("mochilaData");
    if (data) {
      try {
        subjects = JSON.parse(data);
      } catch (e) {
        subjects = [];
      }
    } else {
      subjects = [];
    }
    renderSubjects();
  }

  // Renderiza a lista de matérias utilizando DocumentFragment
  function renderSubjects() {
    subjectsList.innerHTML = "";
    const frag = document.createDocumentFragment();
    subjects.forEach(subject => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="subject-item">
          <span class="color-swatch" style="background: ${subject.color}"></span>
          <span>${subject.name}</span>
        </div>`;
      const btnContainer = document.createElement("div");
      const openBtn = document.createElement("button");
      openBtn.textContent = "Abrir";
      openBtn.addEventListener("click", () => openSubject(subject.id));
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remover";
      removeBtn.addEventListener("click", () => {
        removeSubject(subject.id);
      });
      btnContainer.append(openBtn, removeBtn);
      li.appendChild(btnContainer);
      frag.appendChild(li);
    });
    subjectsList.appendChild(frag);
  }

  // Remove matéria pelo id
  function removeSubject(id) {
    subjects = subjects.filter(s => s.id !== id);
    if (currentSubjectId === id) {
      currentSubjectId = null;
      subjectDetailSection.classList.add("hidden");
    }
    renderSubjects();
    saveData();
  }

  // Abre uma matéria e renderiza seus conteúdos
  function openSubject(id) {
    currentSubjectId = id;
    const subject = subjects.find(s => s.id === id);
    if (subject) {
      subjectTitle.textContent = subject.name;
      subjectTitle.style.color = subject.color;
      renderContents(subject);
      subjectDetailSection.classList.remove("hidden");
    }
  }

  // Renderiza a lista de conteúdos da matéria utilizando DocumentFragment
  function renderContents(subject) {
    contentsList.innerHTML = "";
    const frag = document.createDocumentFragment();
    if (subject.contents) {
      subject.contents.forEach(content => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="content-text">${
          content.text.length > 100 ? content.text.substring(0, 100) + "..." : content.text
        }</div>`;
        const btnContainer = document.createElement("div");
        const openBtn = document.createElement("button");
        openBtn.textContent = "Abrir";
        openBtn.addEventListener("click", () => openContentDetail(content.id));
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Remover";
        deleteBtn.addEventListener("click", () => removeContent(subject.id, content.id));
        btnContainer.append(openBtn, deleteBtn);
        li.appendChild(btnContainer);
        frag.appendChild(li);
      });
    }
    contentsList.appendChild(frag);
    saveData();
  }

  // Cria um novo conteúdo na matéria atual
  newContentBtn.addEventListener("click", () => {
    currentContentId = null;
    contentEditText.innerHTML = "";
    contentDetailSection.classList.remove("hidden");
  });

  // Remove conteúdo de uma matéria
  function removeContent(subjectId, contentId) {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject && subject.contents) {
      subject.contents = subject.contents.filter(c => c.id !== contentId);
      renderContents(subject);
      saveData();
    }
  }

  // Abre o conteúdo para visualização no modo de edição
  function openContentDetail(contentId) {
    currentContentId = contentId;
    const subject = subjects.find(s => s.id === currentSubjectId);
    if (subject && subject.contents) {
      const content = subject.contents.find(c => c.id === contentId);
      if (content) {
        contentDisplay.innerHTML = content.text;
        contentDetailSection.classList.remove("hidden");
      }
    }
  }

  // Evento para editar o conteúdo (modo edição)
  editContentBtn.addEventListener("click", () => {
    contentEditText.innerHTML = contentDisplay.innerHTML;
    contentDisplay.classList.add("hidden");
    contentEditText.parentElement.classList.remove("hidden");
  });

  // Salva o conteúdo (novo ou atualizado)
  saveContentBtn.addEventListener("click", () => {
    const newText = contentEditText.innerHTML;
    const subject = subjects.find(s => s.id === currentSubjectId);
    if (subject) {
      if (currentContentId === null) {
        // Cria novo conteúdo
        const newContent = { id: Date.now(), text: newText };
        if (!subject.contents) subject.contents = [];
        subject.contents.push(newContent);
      } else {
        // Atualiza conteúdo existente
        const content = subject.contents.find(c => c.id === currentContentId);
        if (content) {
          content.text = newText;
        }
      }
      contentDisplay.innerHTML = newText;
      renderContents(subject);
      saveData();
    }
    contentDisplay.classList.remove("hidden");
    contentEditText.parentElement.classList.add("hidden");
  });

  // Cancela a edição do conteúdo
  cancelContentEditBtn.addEventListener("click", () => {
    contentDisplay.classList.remove("hidden");
    contentEditText.parentElement.classList.add("hidden");
  });

  // Tratamento dos botões da Toolbar
  toolbarButtons.forEach(button => {
    button.addEventListener("click", function() {
      const command = button.getAttribute("data-command");
      if (command === "createLink") {
        const url = prompt("Digite a URL:");
        if (url) {
          document.execCommand(command, false, url);
        }
      } else if (command === "insertImage") {
        imageInput.click();
      } else {
        document.execCommand(command, false, null);
      }
    });
  });

  // Upload de imagem
  imageInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.execCommand("insertImage", false, e.target.result);
      };
      reader.readAsDataURL(file);
    }
    this.value = "";
  });

  // Controle de cor do texto
  textColorInput.addEventListener("change", function() {
    contentEditText.focus();
    if (!window.getSelection().toString()) {
      contentEditText.style.color = textColorInput.value;
    } else {
      document.execCommand("foreColor", false, textColorInput.value);
    }
  });

  // Controle do fundo destacado do texto
  highlightColorInput.addEventListener("change", function() {
    contentEditText.focus();
    document.execCommand("hiliteColor", false, highlightColorInput.value);
  });

  // Controle da cor de fundo do editor
  editorBgColorInput.addEventListener("change", function() {
    contentEditText.style.backgroundColor = editorBgColorInput.value;
  });

  // Edição da Matéria: abrir formulário de edição
  editSubjectBtn.addEventListener("click", function() {
    const subject = subjects.find(s => s.id === currentSubjectId);
    if (subject) {
      editSubjectNameInput.value = subject.name;
      editSubjectColorInput.value = subject.color;
      subjectEditDiv.classList.remove("hidden");
    }
  });

  // Salva as alterações da matéria
  saveSubjectBtn.addEventListener("click", function() {
    const subject = subjects.find(s => s.id === currentSubjectId);
    if (subject) {
      subject.name = editSubjectNameInput.value.trim();
      subject.color = editSubjectColorInput.value;
      subjectTitle.textContent = subject.name;
      subjectTitle.style.color = subject.color;
      renderSubjects();
      subjectEditDiv.classList.add("hidden");
      saveData();
    }
  });

  // Cancela a edição da matéria
  cancelEditBtn.addEventListener("click", function() {
    subjectEditDiv.classList.add("hidden");
  });

  // Exclui a matéria
  deleteSubjectBtn.addEventListener("click", function() {
    if (currentSubjectId) {
      removeSubject(currentSubjectId);
      subjectDetailSection.classList.add("hidden");
    }
  });

  // Cria nova matéria (ao submeter o formulário)
  addSubjectForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = subjectNameInput.value.trim();
    const color = subjectColorInput.value;
    if (name !== "") {
      const newSubject = { id: Date.now(), name, color, contents: [] };
      subjects.push(newSubject);
      subjectNameInput.value = "";
      renderSubjects();
      saveData();
    }
  });

  // Navegação: voltar para a lista de matérias
  backToSubjectsBtn.addEventListener("click", () => {
    subjectDetailSection.classList.add("hidden");
  });

  // Navegação: voltar para a landing
  backToLandingBtn.addEventListener("click", () => {
    viewSection.classList.add("hidden");
    editorSection.classList.add("hidden");
    landing.classList.remove("hidden");
  });

  // Landing: ao clicar em "Ver Conteúdos"
  viewBtn.addEventListener("click", () => {
    // Carrega e atualiza os dados do localStorage antes de exibir
    const data = localStorage.getItem("mochilaData");
    if (data) {
      try {
        subjects = JSON.parse(data);
      } catch(e) {
        subjects = [];
      }
    }
    renderPublicContent(subjects);
    landing.classList.add("hidden");
    viewSection.classList.remove("hidden");
  });

  // Landing: ao clicar em "Edit" (exige senha)
  editBtn.addEventListener("click", () => {
    const pwd = prompt("Digite a senha para entrar no modo Edit:");
    if (pwd && pwd.trim() === PASSWORD) {
      landing.classList.add("hidden");
      editorSection.classList.remove("hidden");
      loadData();
    } else {
      alert("Senha incorreta!");
    }
  });

  // Renderiza o conteúdo público (modo read-only)
  function renderPublicContent(data) {
    publicContentDiv.innerHTML = "";
    data.forEach(subject => {
      const section = document.createElement("div");
      section.className = "card";
      section.innerHTML = `<h3 style="color:${subject.color}">${subject.name}</h3>`;
      if (subject.contents) {
        subject.contents.forEach(content => {
          const contentDiv = document.createElement("div");
          contentDiv.innerHTML = `<p>${content.text}</p>`;
          section.appendChild(contentDiv);
        });
      }
      publicContentDiv.appendChild(section);
    });
  }

  // Estado inicial: exibe apenas a landing
  landing.classList.remove("hidden");
  editorSection.classList.add("hidden");
  viewSection.classList.add("hidden");
});
