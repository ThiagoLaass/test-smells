const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpa', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('createUser cria usuário com id e status ativo', () => {
    // Arrange
    const nome = 'Fulano de Tal';
    const email = 'fulano@teste.com';
    const idade = 25;

    // Act
    const usuario = userService.createUser(nome, email, idade);

    // Assert
    expect(usuario.id).toEqual(expect.any(String));
    expect(usuario).toEqual(
      expect.objectContaining({
        nome,
        email,
        idade,
        isAdmin: false,
        status: 'ativo',
        createdAt: expect.any(Date),
      })
    );
  });

  test('getUserById retorna o usuário previamente criado', () => {
    // Arrange
    const usuarioCriado = userService.createUser('Alice', 'alice@email.com', 28);

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado).not.toBeNull();
    expect(usuarioBuscado).toEqual(
      expect.objectContaining({
        id: usuarioCriado.id,
        nome: 'Alice',
        email: 'alice@email.com',
        idade: 28,
        status: 'ativo',
      })
    );
  });

  test('getUserById retorna null quando usuário não existe', () => {
    // Arrange
    const idInexistente = 'id-que-nao-existe';

    // Act
    const usuario = userService.getUserById(idInexistente);

    // Assert
    expect(usuario).toBeNull();
  });

  test('deactivateUser desativa um usuário comum e atualiza o status', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado).toEqual(
      expect.objectContaining({
        id: usuarioComum.id,
        status: 'inativo',
      })
    );
  });

  test('deactivateUser não desativa um usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado).toEqual(
      expect.objectContaining({
        id: usuarioAdmin.id,
        isAdmin: true,
        status: 'ativo',
      })
    );
  });

  test('deactivateUser retorna false quando usuário não é encontrado', () => {
    // Arrange
    const idInexistente = 'id-inexistente';

    // Act
    const resultado = userService.deactivateUser(idInexistente);

    // Assert
    expect(resultado).toBe(false);
  });

  test('generateUserReport contém cabeçalho e dados dos usuários', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('--- Relatório de Usuários ---');

    expect(relatorio).toContain(usuario1.id);
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('ativo');

    expect(relatorio).toContain(usuario2.id);
    expect(relatorio).toContain('Bob');
  });

  test('generateUserReport indica ausência de usuários quando base está vazia', () => {
    // Arrange

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });

  test('createUser lança erro ao tentar criar usuário menor de idade', () => {
    // Arrange
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idade = 17;

    // Act + Assert
    expect(() => userService.createUser(nome, email, idade)).toThrow(
      'O usuário deve ser maior de idade.'
    );
  });
});
