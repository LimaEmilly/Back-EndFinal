const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//>--------------------------------------------------------<

const users = [];
const message = [];

//>--------------------------------------------------------<

app.get("/", (req, res) => {
  if (req.url !== "/") {
    return res.status(404).send("Página não encontrada!");
  }
  res.status(200).send("Bem-vindo!");
});

//>---------------------------------------------------------<

app.post("/signup", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  if (users.some((user) => user.email === email)) {
    return res.status(400).send("Email já cadastrado!");
  }

  const novoUsuario = { id: users.length + 1, nome, email, senha };
  users.push(novoUsuario);

  res.status(201).send(novoUsuario);
});

//>------------------------------------------------------------<

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).send("Insira um Email ou Senha válida.");
  }

  const usuario = users.find((u) => u.email === email && u.senha === senha);

  if (!usuario) {
    return res.status(401).send("Email ou senha incorretos!");
  }

  res.status(200).send(`Bem-vindo, ${usuario.nome}!`);
});

//>-------------------------------------------------------------<

app.post("/criar-conta", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  const novoUsuario = { id: users.length + 1, nome, email, senha };
  users.push(novoUsuario);

  res.status(201).send(novoUsuario);
});


//>-------------------------------------------------------------------<
app.post("/messages", (req, res) => {
  const {título, descrição, email} = req.body;

  if (!título || !descrição || !email) {
    return res.status(400).json("Verificar os dados necessários.")
  }
  if (!users.some((user) => user.email === email)){
    return res.status(404).json("Email não encontrado.")
  }   
  const id = Math.floor(Math.random() * 1000 ) + 1;

  const novaMessage = (id, título, descrição, email);
  message.push(novaMessage);
    return res.status(201).json({message:"Mensagem criada com sucesso!", novaMessage});
  
});

//>------------------------------------------------------------------<
app.get("/messages", async (req, res) => {
  const { email, título, descrição } = req.body;

  if (!email || !título || !descrição) {
    return res.status(400).json({
      error: "Verificar as informações.",
    });
  }

  if (!users.some((user) => user.email === email)) {
    return res.status(404).json({ error: "Email não encontrado!" });
  }

  const id = Math.floor(Math.random() * 1000) + 1;

  const novaMensagem = { id, title, descrição, email };
  mensagens.push(novaMensagem);

  return res.status(201).json({ message: "Criada com sucesso!", novaMensagem });
});

//>-----------------------------------------------------------<

app.put("/mensagem/:id", (req, res) => {
  const { id } = req.params;
  const { título, descrição } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      error: "Por favor, verifique se passou todos os dados necessários.",
    });
  }

  const mensagem = mensagens.find((mensagem) => mensagem.id === parseInt(id));

  if (!mensagem) {
    return res.status(404).json({
      error: "Mensagem não encontrada, verifique o id.",
    });
  }

  mensagem.title = title;
  mensagem.description = description;

  return res.status(200).send({
    mensagem: `Mensagem atualizada com sucesso!`,
    updatedMensagem: mensagem,
  });
});

//>-------------------------------------------------------------------<

app.delete("/mensagem/:id", (req, res) => {
  const { id } = req.params;

  const mensagemIndex = mensagens.findIndex(
    (mensagem) => mensagem.id === parseInt(id)
  );

  if (mensagemIndex === -1) {
    return res.status(404).send({
      error: "Mensagem não encontrada, verifique seu id.",
    });
  }

  mensagens.splice(mensagemIndex, 1);

  return res.status(200).send({ mensagem: "Mensagem apagada com sucesso" });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
