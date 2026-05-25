#  Inove Serralheria

Sistema web de gestão de orçamentos para uma serralheria, desenvolvido com foco em prática de autenticação, CRUD e controle de permissões.

---

##  Sobre o projeto

O **Inove Serralheria** é uma aplicação full stack onde clientes podem criar orçamentos e administradores podem gerenciar todos os pedidos.

O sistema conta com autenticação de usuários, controle de permissões (admin/user) e integração entre frontend e backend.

---

##  Funcionalidades

###  Usuário comum:
- Criar orçamentos
- Visualizar apenas seus próprios orçamentos
- Login e cadastro

###  Administrador:
- Visualizar todos os orçamentos
- Editar orçamentos
- Excluir orçamentos
- Controle de permissões (role)

---

##  Tecnologias utilizadas

### Frontend:
- React
- React Router DOM
- Axios
- CSS

### Backend:
- Node.js
- Fastify
- SQLite
- JWT (autenticação)
- Bcrypt (criptografia de senha)

---

##  Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação.

- Senhas criptografadas com bcrypt
- Rotas protegidas com middleware
- Controle de acesso por role (admin/user)

---

##  Banco de dados

O projeto utiliza SQLite com duas tabelas principais:

- `user` → usuários do sistema
- `orcamentos` → orçamentos criados pelos clientes

---

## Aprendizados

Esse projeto foi desenvolvido com foco em prática de:

- Consumo de API
- Criação de CRUD completo
- Autenticação e autorização
- Controle de permissões
- Integração frontend + backend

---

## Status do projeto

✔ Em desenvolvimento  
✔ Funcional  
⚠ Ainda sem deploy


---

##  Autor

Desenvolvido por Gustavo Castro  
Estudante de Análise e Desenvolvimento de Sistemas – SENAI