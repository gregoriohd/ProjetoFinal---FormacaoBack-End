const express = require('express');
const listarCategorias = require('./controladores/categorias');
const verificaLogin = require('./filtros/verificaLogin');

const {
    redefinirSenha,
    loginUsuario } = require('./controladores/login');

const {
    cadastrarUsuario,
    editarPerfilUsuario,
    buscarUsuario } = require('./controladores/usuarios');

const { cadastrarProduto, atualizarSemIdProduto, atualizarProduto,
    listarProdutos, detalharProduto, excluirProduto } = require('./controladores/produtos');

const { cadastrarCliente, atualizarCliente,
    listarCliente, detalharCliente } = require('./controladores/clientes');

const uploadImg = require('./controladores/upload');

const { cadastrarPedido, listarPedidos } = require('./controladores/pedido');


const rotas = express();
// Listar categorias e cadastrar, efetuar login e redefinir senha do usuário
rotas.get('/categoria', listarCategorias);
rotas.patch('/usuario/redefinir', redefinirSenha);
rotas.post('/usuario', cadastrarUsuario);
rotas.post("/login", loginUsuario);


rotas.use(verificaLogin);

// Detalhar e editar perfil do usuário logado 
rotas.put('/usuario', editarPerfilUsuario);
rotas.get("/usuario", buscarUsuario);

//produtos
rotas.get('/produto/:id', detalharProduto);
rotas.post('/produto', cadastrarProduto);
rotas.put('/produto/:id', atualizarProduto);
rotas.put('/produto', atualizarSemIdProduto);
rotas.get('/produto', listarProdutos);
rotas.delete('/produto/:id', excluirProduto);

//clientes
rotas.post('/cliente', cadastrarCliente);
rotas.put('/cliente/:id', atualizarCliente);
rotas.get('/cliente', listarCliente);
rotas.get('/cliente/:id', detalharCliente);

//upload
rotas.post('/upload', uploadImg);

//pedidos
rotas.post('/pedido', cadastrarPedido);
rotas.get('/pedido', listarPedidos);


module.exports = rotas;