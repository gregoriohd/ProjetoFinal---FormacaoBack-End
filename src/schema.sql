create database pdv;

create table usuarios(id serial primary key, nome varchar(100) not null, email varchar(100) unique not null, senha text not null);

create table categorias(id serial primary key, descricao text not null);

insert into categorias(descricao) values ('Informática'),('Celulares'),('Beleza e Perfumaria'),('Mercado'),
('Livros e Papelaria'),('Brinquedos'),('Moda'),('Bebê'),('Games');

create table produtos (id serial primary key,
descricao text not null,
quantidade_estoque integer not null, valor integer not null,
categoria_id int not null,
foreign key(categoria_id) references categorias(id));

create table clientes(id serial primary key, nome varchar(100) not null,
email varchar(100) unique not null, cpf char(11) unique not null,
cep char(8), rua text, numero integer, bairro text, cidade text, estado varchar(50));

create table pedidos (id serial primary key, cliente_id int not null,
observacao text, valor_total int not null, foreign key(cliente_id) references clientes(id));

create table pedido_produtos(id serial primary key, pedido_id int not null, produto_id int not null,
quantidade_produto int not null, valor_produto int not null,
foreign key(pedido_id) references pedidos(id), foreign key(produto_id) references produtos(id));

alter table produtos add column produto_imagem text;