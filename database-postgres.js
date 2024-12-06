import { sql } from './db.js';

export class DataBasePostgres {

  // Criar Prato
  async createPrato(prato) {
    const { name, foto, description, price, tipoprato } = prato;
    await sql`
        INSERT INTO Pratos (name, foto, description, price, tipoprato) 
        VALUES (${name}, ${foto}, ${description}, ${price}, ${tipoprato})
      `;
  }

  // Listar Pratos
  async listPratos() {
    const pratos = await sql`
      SELECT * FROM Pratos 
    `;
    return pratos;
  }

  // Atualizar Prato
  async updatePrato(id, prato) {
    const { name, foto, description, price, tipoprato } = prato;

    try {
      await sql`
        UPDATE Pratos 
        SET name = ${name}, foto = ${foto}, description = ${description}, price = ${price}, tipoprato = ${tipoprato}
        WHERE pratosid = ${id}
      `;
      console.log("Prato atualizado com sucesso:", { id, prato });
    } catch (error) {
      console.error("Erro ao atualizar prato:", error);
      throw new Error("Erro ao atualizar prato");
    }
  }

  // Deletar Prato
  async deletePrato(id) {
    try {
      await sql`DELETE FROM Pratos WHERE pratosid = ${id}`;
      console.log("Prato deletado com sucesso:", id);
    } catch (error) {
      console.error("Erro ao deletar prato:", error);
      throw new Error("Erro ao deletar prato");
    }
  }

  // Criar Cliente
  async createCliente(cliente) {
    const { nome, gmail, whats } = cliente;
  
    // Obter o id do restaurante
    const idRestaurante = await this.getRestauranteId();
  
    // Verificar se o restaurante existe
    if (!idRestaurante) {
      throw new Error("Restaurante não encontrado");
    }
  
    // Criar cliente sem o idComanda
    await sql`
      INSERT INTO Cliente (nome, gmail, whats, idRestaurante) 
      VALUES (${nome}, ${gmail}, ${whats}, ${idRestaurante})
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
  // Aqui há a função de pegar o id do cliente
  async getClienteById(id) {
    const cliente = await sql`
      SELECT * FROM Cliente WHERE usuarioid = ${id}
    `;
    return cliente.length > 0 ? cliente[0] : null;
  }
  // Atualizar Cliente
  async updateCliente(id, cliente) {
    const { nome, gmail, whats } = cliente;

    await sql`
      UPDATE Cliente 
      SET nome = ${nome}, gmail = ${gmail}, whats = ${whats} 
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
      datapedid,
      valor_total,
      desc_pedido,
      idRestaurante,
    } = pedido;
    const [pedidoNovo] = await sql`
      INSERT INTO Pedido (datapedid, valor_total, desc_pedido, idRestaurante) 
      VALUES (${datapedid}, ${valor_total}, ${desc_pedido}, ${idRestaurante})
      RETURNING pedidoID
    `;
   return pedidoNovo.pedidoid
  }

async createItemPedido(item) {
  const {
    idPedido,
    idPrato
  } = item;
  await sql`
    INSERT INTO item_pedido (idPedido, idPrato) 
    VALUES (${idPedido}, ${idPrato})
  `;
  // const itemPedido = await sql`SELECT pedidoID  FROM Pedido`;
  // return pedido[0].pedidoId;
}
  // Listar Pedidos
  async listPedidos(search) {
    const pedidos = await sql`
      SELECT * FROM Pedido
    `;
    return pedidos;
  }

  // Atualizar Pedido
  async updatePedido(id, pedido) {
    const {
      status,
      datapedid,
      valor_total,
      desc_pedido,
    } = pedido;

    await sql`
      UPDATE Pedido 
      SET 
        status = ${status},
        datapedid = ${datapedid},
        valor_total = ${valor_total},
        desc_pedido = ${desc_pedido}
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

    try {
      // Verificação de dados antes da inserção
      if (!cnpj || !nome || !endereco) {
        throw new Error("Dados obrigatórios não fornecidos");
      }



      // Realizar a inserção no banco
      await sql`
      INSERT INTO Restaurante (cnpj, nome, endereco, cep, cidade, bairro, num, compl, telefone, capacidade)
      VALUES (${cnpj}, ${nome}, ${endereco}, ${cep}, ${cidade}, ${bairro}, ${num}, ${compl}, ${telefone}, ${capacidade})
      RETURNING * 
    `;
      console.log("Inserção realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao executar o INSERT:", error);
      console.error("Detalhes do erro:", error.stack);
      throw new Error("Erro ao criar restaurante");
    }
  }


  // Listar Restaurantes
  async listRestaurante() {
    try {
      const result = await sql`
        SELECT * FROM Restaurante
      `;
      console.log("Resultado da consulta:", result);
      return result;
    } catch (error) {
      console.error("Erro ao buscar restaurantes:", error);
      throw new Error("Erro ao buscar restaurantes");
    }
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
  async createComanda(usuarioid, idPedido, idRestaurante) {
    await sql`
      INSERT INTO Comanda (usuarioid, idPedido, idRestaurante) 
      VALUES (${usuarioid}, ${idPedido}, ${idRestaurante});
    `;
  }

  // Listar Comandas
  async listComanda(search) {
    const comanda = await sql`
      SELECT * FROM Comanda
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
