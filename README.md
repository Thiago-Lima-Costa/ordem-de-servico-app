Documentação do Sistema de Controle de Ordens de Serviço


Visão Geral

Este é um aplicativo mobile desenvolvido com React Native, utilizando Expo para facilitar a criação, testes e build do projeto. O app permite gerenciar ordens de serviço, além de controlar receitas e despesas do setor administrativo.


Tecnologias Utilizadas:
- React Native;
- Expo;
- Expo Router;
- Firebase Firestore;
- Firebase SDK;


Estrutura do Projeto

A estrutura do projeto segue a organização padrão do Expo, com a separação das telas e configuração do Firebase.
- firebase.js → Configuração do Firebase Firestore
- App.js → Arquivo principal, configura a navegação
- app/ordens.js → Lista as ordens de serviço cadastradas
- app/nova-ordem.js → Tela para criar uma nova ordem de serviço
- app/editar-ordem.js → Tela para editar uma ordem existente
- app/administrativo.js → Tela principal do administrativo
- app/caixa.js → Tela que exibe receitas e despesas do mês selecionado
- app/cadastrar-receita.js → Tela para adicionar uma nova receita
- app/cadastrar-despesa.js → Tela para adicionar uma nova despesa


Navegação

O app utiliza expo-router para gerenciar a navegação, seguindo um modelo baseado na estrutura de arquivos e diretórios do projeto. Cada arquivo dentro da pasta app/ representa uma rota, permitindo navegação automática.


Fluxo do Usuário

1- Tela Inicial:
Exibe dois botões principais: Ordens de Serviço e Administrativo.

2- Ordens de Serviço:
Lista todas as OS cadastradas;
Permite adicionar uma nova OS;
Ao clicar em uma OS, leva para a tela de edição.

3- Nova OS
Formulário para cadastrar uma nova ordem de serviço;
O número da OS é gerado automaticamente com base no contador armazenado no Firebase.

4- Editar OS
Permite alterar os dados da OS;
Adiciona novos campos como diagnóstico, valor do serviço e data de saída;
O status pode ser alterado para pendente, orçamento realizado, serviço autorizado ou concluído.

5- Administrativo
Tela com três opções: Caixa, Cadastrar Receita e Cadastrar Despesa.

6- Caixa
Exibe receitas e despesas de um mês selecionado;
Calcula e exibe o saldo total.

7- Cadastrar Receita/Despesa
Formulários para adicionar novas receitas ou despesas ao sistema.


Persistência de Dados

O sistema usa Firebase Firestore como banco de dados, garantindo armazenamento em nuvem e sincronização em tempo real.


Coleções no Firestore

- ordens_servico → Contém todas as ordens de serviço cadastradas
- receitas → Contém os registros de receitas
- despesas → Contém os registros de despesas
- contador → Documento único que armazena contador_os, utilizado para gerar o número da OS automaticamente


Como Rodar o Projeto

1- Instale as dependências:

npm install

2- Inicie o projeto no Expo:

expo start

3- Configure a conexão com o Firebase.

4- Escaneie o QR Code no Expo Go para testar no celular ou rode no emulador.