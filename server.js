const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors"); // Importe o pacote cors

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "*", // Permite apenas requisições do frontend
}));

// Configuração do Multer para armazenar arquivos na pasta "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Cria a pasta "uploads" se não existir
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Rota para upload de arquivos

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Nenhum arquivo foi enviado.");
  }
  res.send(`Arquivo "${req.file.filename}" enviado com sucesso!`);
});

app.get("/files", (req, res) => {
  fs.readdir("uploads/", (err, files) => {
    if (err) {
      return res.status(500).send("Erro ao ler arquivos.");
    }
    res.json(files);
  });
});

// Rota para baixar um arquivo
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send("Arquivo não encontrado.");
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});