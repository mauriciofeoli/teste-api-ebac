/// <reference types="cypress" />

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('GET', '/usuarios').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quantidade');
      expect(response.body.usuarios[0]).to.have.all.keys(
        ['nome', 'email', 'password', 'administrador', '_id']
      );
    });
  });


  it('Deve listar usuários cadastrados', () => {
    cy.request('GET', '/usuarios').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.usuarios).to.be.an('array');
    });
  });


  it('Deve cadastrar um usuário com sucesso', () => {
    const usuario = {
      nome: 'Mauricio Feoli',
      email: `mauricio${Date.now()}@teste.com`,
      password: 'teste123',
      administrador: 'true'
    };


    cy.request('POST', '/usuarios', usuario).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
    });
  });


  it('Deve validar um usuário com email inválido', () => {
    const usuario = {
      nome: 'Mauricio Feoli',
      email: 'constitucionalista@brasil',
      password: 'teste123',
      administrador: 'true'
    };


    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: usuario,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.email).to.eq('email deve ser um email válido');
    });
  });


  it('Deve editar um usuário cadastrado no próprio teste', () => {
    const email = `editar${Date.now()}@teste.com`;


    cy.request('POST', '/usuarios', {
      nome: 'Mauricio Feoli - Editado',
      email: email,
      password: 'teste123',
      administrador: 'true'
    }).then((response) => {
      const id = response.body._id;


      cy.request('PUT', `/usuarios/${id}`, {
        nome: 'Mauricio Feoli - Editado',
        email: `editado${Date.now()}@teste.com`,
        password: 'teste123',
        administrador: 'false'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro alterado com sucesso');
      });
    });
  });


  it('Deve deletar um usuário cadastrado no próprio teste', () => {
    const email = `deletar${Date.now()}@teste.com`;


    cy.request('POST', '/usuarios', {
      nome: 'Mauricio Feoli - Del',
      email: email,
      password: 'teste123',
      administrador: 'true'
    }).then((response) => {
      const id = response.body._id;


      cy.request('DELETE', `/usuarios/${id}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    });
  });

  
  it('Não deve permitir cadastro com email duplicado', () => {
    const email = `duplicado${Date.now()}@teste.com`;
    const usuario = {
      nome: 'Mauricio Feoli - Duplicado',
      email: email,
      password: '123456',
      administrador: 'true'
    };


    cy.request('POST', '/usuarios', usuario).then(() => {
      cy.request({
        method: 'POST',
        url: '/usuarios',
        body: usuario,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Este email já está sendo usado');
      });
    });
  });


});