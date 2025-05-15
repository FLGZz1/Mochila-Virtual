// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Pasta onde estão os arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Caminho para o arquivo de dados
const DATA_FILE = path.join(__dirname, 'data.json');

// Endpoint GET: retorna os dados (ou um array vazio se o arquivo não existir)
app.get('/api/data', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      if(err.code === 'ENOENT'){
        return res.json([]); // se não existe, retorna array vazio
      }
      return res.status(500).json({ error: "Erro ao ler o arquivo de dados." });
    }
    try {
      const db = JSON.parse(data);
      res.json(db);
    } catch(e) {
      res.status(500).json({ error: "Erro ao processar o arquivo de dados." });
    }
  });
});

// Endpoint POST: salva os dados (recebe um array com todas as matérias)
app.post('/api/data', (req, res) => {
  const newData = req.body;
  fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), err => {
    if(err) {
      return res.status(500).json({ error: "Erro ao salvar os dados." });
    }
    res.json({ status: "sucesso" });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
