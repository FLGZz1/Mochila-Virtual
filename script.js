document.addEventListener("DOMContentLoaded", function() {
  let subjects = [];           // Array para armazenar matérias
  let currentSubjectId = null; // Matéria atualmente aberta
  let currentContentId = null; // Conteúdo atualmente aberto
  
  /* Elementos: Matérias */
  const addSubjectForm = document.getElementById("add-subject-form");
  const subjectNameInput = document.getElementById("subject-name");
  const subjectColorInput = document.getElementById("subject-color");
  const subjectsList = document.getElementById("subjects-list");
  
  const subjectDetailSection = document.getElementById("subject-detail");
  const backToSubjectsButton = document.getElementById("back-to-subjects");
  const subjectTitle = document.getElementById("subject-title");
  const editSubjectButton = document.getElementById("edit-subject");
  const deleteSubjectButton = document.getElementById("delete-subject");
  
  const subjectEditDiv = document.getElementById("subject-edit");
  const editSubjectNameInput = document.getElementById("edit-subject-name");
  const editSubjectColorInput = document.getElementById("edit-subject-color");
  const saveSubjectButton = document.getElementById("save-subject");
  const cancelEditButton = document.getElementById("cancel-edit");

  /* Elementos: Conteúdos */
  const addContentForm = document.getElementById("add-content-form");
  const contentTextTextarea = document.getElementById("content-text");
  const contentsList = document.getElementById("contents-list");
  
  /* Elementos: Detalhe do Conteúdo */
  const contentDetailSection = document.getElementById("content-detail");
  const backToContentsButton = document.getElementById("back-to-contents");
  const contentDisplay = document.getElementById("content-display");
  const contentEditText = document.getElementById("content-edit-text");
  const editContentBtn = document.getElementById("edit-content-btn");
  const saveContentBtn = document.getElementById("save-content-btn");
  const cancelContentEditBtn = document.getElementById("cancel-content-edit-btn");
  
  // Toolbar: Para cada botão da barra de ferramentas
  const toolbarButtons = document.querySelectorAll("#editor-toolbar button");
  toolbarButtons.forEach(button => {
    button.addEventListener("click", function() {
      const command = button.getAttribute("data-command");
      let value = null;
      // Para comandos que necessitam de parâmetro, use prompt.
      if(command === "createLink") {
        value = prompt("Digite a URL para o link:", "https://");
        if(!value) return;
      } else if (command === "insertImage") {
        value = prompt("Digite a URL da imagem:", "https://");
        if(!value) return;
      } else if (command === "foreColor") {
        value = prompt("Digite a cor do texto (ex: #ff0000 ou red):", "#000000");
        if(!value) return;
      } else if (command === "hiliteColor") {
        value = prompt("Digite a cor do fundo (ex: #ffff00 ou yellow):", "#ffff00");
        if(!value) return;
      }
      document.execCommand(command, false, value);
    });
  });
  
  /* Funções de Matérias */
  function renderSubjects() {
    subjectsList.innerHTML = "";
    subjects.forEach(subject => {
      const li = document.createElement("li");
      
      // Exibição: cor (swatch) + nome
      const subjectItemDiv = document.createElement("div");
      subjectItemDiv.classList.add("subject-item");
      
      const colorSwatch = document.createElement("span");
      colorSwatch.classList.add("color-swatch");
      colorSwatch.style.backgroundColor = subject.color;
      
      const nameSpan = document.createElement("span");
      nameSpan.textContent = subject.name;
      
      subjectItemDiv.appendChild(colorSwatch);
      subjectItemDiv.appendChild(nameSpan);
      li.appendChild(subjectItemDiv);
      
      // Ações: Abrir e Remover
      const actionsDiv = document.createElement("div");
      
      const openButton = document.createElement("button");
      openButton.textContent = "Abrir";
      openButton.addEventListener("click", function() {
        openSubject(subject.id);
      });
      actionsDiv.appendChild(openButton);
      
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remover";
      removeButton.addEventListener("click", function() {
        removeSubject(subject.id);
      });
      actionsDiv.appendChild(removeButton);
      
      li.appendChild(actionsDiv);
      subjectsList.appendChild(li);
    });
  }
  
  // Adiciona nova matéria
  addSubjectForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = subjectNameInput.value.trim();
    const color = subjectColorInput.value;
    if(name !== "") {
      const newSubject = {
        id: Date.now(),
        name,
        color,
        contents: [] // Inicialmente sem conteúdos
      };
      subjects.push(newSubject);
      subjectNameInput.value = "";
      renderSubjects();
    }
  });
  
  function removeSubject(id) {
    subjects = subjects.filter(s => s.id !== id);
    if(currentSubjectId === id) {
      currentSubjectId = null;
      subjectDetailSection.classList.add("hidden");
      document.getElementById("subjects-management").classList.remove("hidden");
    }
    renderSubjects();
  }
  
  function openSubject(id) {
    currentSubjectId = id;
    const subject = subjects.find(s => s.id === id);
    if(subject) {
      subjectTitle.textContent = subject.name;
      subjectTitle.style.color = subject.color;
      renderContents(subject);
      subjectDetailSection.classList.remove("hidden");
      document.getElementById("subjects-management").classList.add("hidden");
      subjectEditDiv.classList.add("hidden");
    }
  }
  
  backToSubjectsButton.addEventListener("click", function(){
    subjectDetailSection.classList.add("hidden");
    document.getElementById("subjects-management").classList.remove("hidden");
    currentSubjectId = null;
  });
  
  /* Funções de Conteúdos */
  function renderContents(subject) {
    contentsList.innerHTML = "";
    subject.contents.forEach(content => {
      const li = document.createElement("li");
      li.classList.add("content-item");
      
      const contentDiv = document.createElement("div");
      contentDiv.classList.add("content-text");
      // Exibe uma prévia (até 100 caracteres) contendo formatações HTML
      contentDiv.innerHTML = content.text.length > 100 ? content.text.substring(0, 100) + "..." : content.text;
      li.appendChild(contentDiv);
      
      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("content-buttons");
      
      // Botão para abrir o conteúdo (modo visualização/edição)
      const openButton = document.createElement("button");
      openButton.textContent = "Abrir";
      openButton.addEventListener("click", function() {
        openContentDetail(content.id);
      });
      buttonsDiv.appendChild(openButton);
      
      // Botão para remover o conteúdo
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Remover";
      deleteButton.addEventListener("click", function() {
        removeContent(subject.id, content.id);
      });
      buttonsDiv.appendChild(deleteButton);
      
      li.appendChild(buttonsDiv);
      contentsList.appendChild(li);
    });
  }
  
  addContentForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const text = contentTextTextarea.value.trim();
    if (text !== "" && currentSubjectId !== null) {
      const subject = subjects.find(s => s.id === currentSubjectId);
      if(subject) {
        subject.contents.push({
          id: Date.now(),
          text
        });
        contentTextTextarea.value = "";
        renderContents(subject);
      }
    }
  });
  
  function removeContent(subjectId, contentId) {
    const subject = subjects.find(s => s.id === subjectId);
    if(subject) {
      subject.contents = subject.contents.filter(c => c.id !== contentId);
      renderContents(subject);
    }
  }
  
  /* Gerenciamento do Conteúdo Detalhado (Editor) */
  function openContentDetail(contentId) {
    currentContentId = contentId;
    const subject = subjects.find(s => s.id === currentSubjectId);
    if (subject) {
      const content = subject.contents.find(c => c.id === contentId);
      if(content) {
        subjectDetailSection.classList.add("hidden");
        contentDetailSection.classList.remove("hidden");
        // Exibe o conteúdo com formatação (HTML)
        contentDisplay.innerHTML = content.text;
        document.getElementById("content-view-mode").classList.remove("hidden");
        document.getElementById("content-edit-mode").classList.add("hidden");
      }
    }
  }
  
  backToContentsButton.addEventListener("click", function() {
    contentDetailSection.classList.add("hidden");
    subjectDetailSection.classList.remove("hidden");
    currentContentId = null;
  });
  
  // Muda para o modo de edição: copia o conteúdo para o editor (contenteditable)
  editContentBtn.addEventListener("click", function() {
    contentEditText.innerHTML = contentDisplay.innerHTML;
    document.getElementById("content-view-mode").classList.add("hidden");
    document.getElementById("content-edit-mode").classList.remove("hidden");
  });
  
  // Salva as alterações do conteúdo
  saveContentBtn.addEventListener("click", function() {
    const newText = contentEditText.innerHTML;
    const subject = subjects.find(s => s.id === currentSubjectId);
    if(subject) {
      const content = subject.contents.find(c => c.id === currentContentId);
      if(content) {
        content.text = newText;
        contentDisplay.innerHTML = newText;
        renderContents(subject);
      }
    }
    document.getElementById("content-view-mode").classList.remove("hidden");
    document.getElementById("content-edit-mode").classList.add("hidden");
  });
  
  cancelContentEditBtn.addEventListener("click", function() {
    document.getElementById("content-view-mode").classList.remove("hidden");
    document.getElementById("content-edit-mode").classList.add("hidden");
  });
  
  /* Edição da Matéria */
  editSubjectButton.addEventListener("click", function(){
    const subject = subjects.find(s => s.id === currentSubjectId);
    if(subject) {
      editSubjectNameInput.value = subject.name;
      editSubjectColorInput.value = subject.color;
      subjectEditDiv.classList.remove("hidden");
    }
  });
  
  saveSubjectButton.addEventListener("click", function(){
    const subject = subjects.find(s => s.id === currentSubjectId);
    if(subject) {
      subject.name = editSubjectNameInput.value.trim();
      subject.color = editSubjectColorInput.value;
      subjectTitle.textContent = subject.name;
      subjectTitle.style.color = subject.color;
      renderSubjects();
      subjectEditDiv.classList.add("hidden");
    }
  });
  
  cancelEditButton.addEventListener("click", function(){
    subjectEditDiv.classList.add("hidden");
  });
  
  deleteSubjectButton.addEventListener("click", function(){
    if(currentSubjectId) {
      removeSubject(currentSubjectId);
      subjectDetailSection.classList.add("hidden");
      document.getElementById("subjects-management").classList.remove("hidden");
    }
  });
});
