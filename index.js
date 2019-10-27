const express = require('express');

const server = express();
server.use(express.json());

// query params = ?teste=1
// Route params = /users/1
// request body = { "name": "Andrei", "email": "andrei@gmail.com"}
const users = ['Vegeta', 'Naruto', 'Seiya'];

//middlewares global, toda requisição passa por aqui
server.use((req, res, next) => {
  console.time('Request');

  console.log(`Method: ${req.method}; URL: ${req.url}`);
  next();

  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  if(!req.body.name){
    return res.status(400).json({ error: 'Nome do usuario é requerido!'});
  }

  return next();
};

function checkUserInArray(req, res, next){
  const user= users[req.params.index];

  if(!user) {
    return res.status(404).json({ error: 'Usuario não existe!'})
  }
  req.user = user;
  return next();
};

function returnUserMap (users) {
  return users.map(user => ({name: `${user}`})) 
};

server.get('/teste', (req, res) => {
  const { nome } = req.query;
  return res.json({ message: `HELLO ${nome}`}) ;
});

server.get('/users', (req, res) => {
  const usuario = returnUserMap(users);
  return res.json({Users: usuario});
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;
  const usuario = returnUserMap(users)
  return res.json(usuario[index]);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  const usuario = returnUserMap(users);
  return res.json({Users: usuario});
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;

  users[index] = name;
  const usuario = returnUserMap(users);
  return res.json({Users: usuario});
});

server.delete('/users/:index', checkUserInArray, (req, res) => {

  const { index } = req.params;
  const usuario = users[index];
  users.splice(index, 1);
  return res.send({ 'message': `Usuario: ${usuario}, foi excluido com sucesso`});
})
server.listen(3000);