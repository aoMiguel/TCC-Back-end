import pkg from 'sql-tag';
const { sql } = pkg;

export class DataBasePostgres {
  // Criar Prato
  async createPrato(prato) {
    const { name, foto, description, price } = prato;

    await sql`
      INSERT INTO Pratos (name, foto, description, price) 
      VALUES (${name}, ${foto}, ${description}, ${price})
    `;
  }

  // Listar Pratos
  async listPratos(search) {
    const pratos = await sql`
      SELECT * FROM Pratos 
      WHERE name ILIKE '%' || ${search} || '%' 
      OR description ILIKE '%' || ${search} || '%'
    `;
    return pratos;
  }

  // Atualizar Prato
  async updatePrato(id, prato) {
    const { name, foto, description, price } = prato;

    await sql`
      UPDATE Pratos 
      SET name = ${name}, foto = ${foto}, description = ${description}, price = ${price}
      WHERE pratosid = ${id}
    `;
  }

  // Deletar Prato
  async deletePrato(id) {
    await sql`DELETE FROM Pratos WHERE pratosid = ${id}`;
  }

  // Criar Cliente
  async createCliente(cliente) {
    const { nome, gmail, whats } = cliente;

    const idComanda = await this.getComandaId();
    const idRestaurante = await this.getRestauranteId();

    if (!idComanda || !idRestaurante) {
      throw new Error("Comanda ou Restaurante não encontrados"); // Lançar erro para ser tratado no servidor
    }

    await sql`
      INSERT INTO Cliente (nome, gmail, whats, idComanda, idRestaurante) 
      VALUES (${nome}, ${gmail}, ${whats}, ${idComanda}, ${idRestaurante})
    `;
  }

  // Listar Clientes
  async listUsuarios(search) {
    const usuarios = await sql`
      SELECT * FROM Cliente 
      WHERE gmail ILIKE '%' || ${search} || '%'
    `;
    return usuarios;
  }

  // Atualizar Cliente
  async updateCliente(id, cliente) {
    const { gmail, whats } = cliente;

    await sql`
      UPDATE Cliente 
      SET gmail = ${gmail}, whats = ${whats} 
      WHERE usuarioid = ${id}
    `;
  }

  // Deletar Cliente
  async deleteCliente(id) {
    await sql`DELETE FROM Cliente WHERE usuarioid = ${id}`;
  }

  // Login Cliente
  async loginCliente(gmail, nome, whats) {
    const result = await sql`
      SELECT * FROM Cliente 
      WHERE gmail = ${gmail} AND nome = ${nome} AND whats = ${whats}
    `;
    return result[0] || null;
  }

  // Criar Pedido
  async createPedido(pedido) {
    const {
      quant,
      status,
      datapedid,
      valor_total,
      desc_pedido,
      pratosid,
      id_comanda_num,
      idRestaurante,
    } = pedido;

    await sql`
      INSERT INTO Pedido (quant, status, datapedid, valor_total, desc_pedido, pratosid, id_comanda_num, idRestaurante) 
      VALUES (${quant}, ${status}, ${datapedid}, ${valor_total}, ${desc_pedido}, ${pratosid}, ${id_comanda_num}, ${idRestaurante})
    `;
  }

  // Listar Pedidos
  async listPedidos(search) {
    const pedidos = await sql`
      SELECT * FROM Pedido 
      WHERE desc_pedido ILIKE '%' || ${search} || '%'
    `;
    return pedidos;
  }

  // Atualizar Pedido
  async updatePedido(id, pedido) {
    const {
      quant,
      status,
      datapedid,
      valor_total,
      desc_pedido,
      pratosid,
      id_comanda_num,
      idRestaurante,
    } = pedido;

    await sql`
      UPDATE Pedido 
      SET quant = ${quant}, status = ${status}, datapedid = ${datapedid}, valor_total = ${valor_total}, desc_pedido = ${desc_pedido}, pratosid = ${pratosid}, id_comanda_num = ${id_comanda_num}, idRestaurante = ${idRestaurante}
      WHERE pedidoID = ${id}
    `;
  }

  // Deletar Pedido
  async deletePedido(id) {
    await sql`DELETE FROM Pedido WHERE pedidoID = ${id}`;
  }

  // Criar Restaurante
  async createRestaurante(restaurante) {
    const {
      cnpj,
      nome,
      endereco,
      cep,
      cidade,
      bairro,
      num,
      compl,
      telefone,
      capacidade,
    } = restaurante;

    await sql`
      INSERT INTO Restaurante (cnpj, nome, endereco, cep, cidade, bairro, num, compl, telefone, capacidade) 
      VALUES (${cnpj}, ${nome}, ${endereco}, ${cep}, ${cidade}, ${bairro}, ${num}, ${compl}, ${telefone}, ${capacidade})
    `;
  }

  // Listar Restaurantes
  async listRestaurante(search) {
    const restaurante = await sql`
      SELECT * FROM Restaurante 
      WHERE nome ILIKE '%' || ${search} || '%'
    `;
    return restaurante;
  }

  // Atualizar Restaurante
  async updateRestaurante(id, restaurante) {
    const {
      cnpj,
      nome,
      endereco,
      cep,
      cidade,
      bairro,
      num,
      compl,
      telefone,
      capacidade,
    } = restaurante;

    await sql`
      UPDATE Restaurante 
      SET cnpj = ${cnpj}, nome = ${nome}, endereco = ${endereco}, cep = ${cep}, cidade = ${cidade}, bairro = ${bairro}, num = ${num}, compl = ${compl}, telefone = ${telefone}, capacidade = ${capacidade}
      WHERE idRestaurante = ${id}
    `;
  }

  // Deletar Restaurante
  async deleteRestaurante(id) {
    await sql`DELETE FROM Restaurante WHERE idRestaurante = ${id}`;
  }

  // Criar Comanda
  async createComanda(usuarioid, pratosid, idRestaurante) {
    await sql`
      INSERT INTO Comanda (usuarioid, pratosid, idRestaurante) 
      VALUES (${usuarioid}, ${pratosid}, ${idRestaurante});
    `;
  }

  // Listar Comandas
  async listComanda(search) {
    const comanda = await sql`
      SELECT * FROM Comanda 
      WHERE usuarioid::text ILIKE '%' || ${search} || '%'
    `;
    return comanda;
  }

  // Atualizar Comanda
  async updateComanda(id, comanda) {
    const { pratosid } = comanda;

    await sql`
      UPDATE Comanda 
      SET pratosid = ${pratosid}
      WHERE IDcomanda_num = ${id}
    `;
  }

  // Deletar Comanda
  async deleteComanda(id) {
    await sql`DELETE FROM Comanda WHERE IDcomanda_num = ${id}`;
  }

  // Obter ID de Usuário
  async getUsuarioId() {
    const result = await sql`SELECT usuarioid FROM Cliente LIMIT 1`;
    return result[0]?.usuarioid;
  }

  // Obter ID de Comanda
  async getComandaId() {
    const result = await sql`SELECT IDcomanda_num FROM Comanda ORDER BY IDcomanda_num DESC LIMIT 1`;
    return result[0]?.IDcomanda_num;
  }

  // Obter ID de Restaurante
  async getRestauranteId() {
    const result = await sql`SELECT idRestaurante FROM Restaurante ORDER BY idRestaurante DESC LIMIT 1`;
    return result[0]?.idRestaurante;
  }
}
