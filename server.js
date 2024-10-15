import fastify from 'fastify';
import { DataBasePostgres } from './database-postgres.js';
import cors from 'fastify-cors';

const database = new DataBasePostgres();
const server = fastify();

server.register(cors, {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
// Rotas para Pratos
server.post("/pratos", async (request, reply) => {
    try {
        const { name, foto, description, price } = request.body;
        await database.createPrato({ name, foto, description, price });
        reply.status(201).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

server.get("/pratos", async (request) => {
    try {
        const search = request.query.search || '';
        const pratos = await database.listPratos(search);
        return pratos;
    } catch (error) {
        return { error: error.message };
    }
});

server.put("/pratos/:id", async (request, reply) => {
    try {
        const pratosID = request.params.id;
        const { name, foto, description, price } = request.body;

        // Verificar se o prato existe
        const pratoExistente = await database.getPratoById(pratosID);
        if (!pratoExistente) {
            return reply.status(404).send({ error: "Prato não encontrado" });
        }

        await database.updatePrato(pratosID, { name, foto, description, price });
        reply.status(204).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

server.delete("/pratos/:id", async (request, reply) => {
    try {
        const pratosID = request.params.id;

        // Verificar se o prato existe
        const pratoExistente = await database.getPratoById(pratosID);
        if (!pratoExistente) {
            return reply.status(404).send({ error: "Prato não encontrado" });
        }

        await database.deletePrato(pratosID);
        reply.status(204).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

// Rotas para Clientes
server.post("/cliente", async (request, reply) => {
    try {
        const { nome, gmail, whats } = request.body;
        const idComanda = await database.getComandaId();
        const idRestaurante = await database.getRestauranteId();
        await database.createCliente({ nome, gmail, whats, idComanda, idRestaurante });
        reply.status(201).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

server.get("/cliente", async (request) => {
    try {
        const search = request.query.search || '';
        const usuarios = await database.listUsuarios(search);
        return usuarios;
    } catch (error) {
        return { error: error.message };
    }
});

server.put("/cliente/:id", async (request, reply) => {
    try {
        const usuarioID = request.params.id;
        const { nome, gmail, whats } = request.body;

        // Verificar se o cliente existe
        const clienteExistente = await database.getClienteById(usuarioID);
        if (!clienteExistente) {
            return reply.status(404).send({ error: "Cliente não encontrado" });
        }

        await database.updateCliente(usuarioID, { nome, gmail, whats });
        reply.status(204).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

server.delete("/cliente/:id", async (request, reply) => {
    try {
        const usuarioID = request.params.id;

        // Verificar se o cliente existe
        const clienteExistente = await database.getClienteById(usuarioID);
        if (!clienteExistente) {
            return reply.status(404).send({ error: "Cliente não encontrado" });
        }

        await database.deleteCliente(usuarioID);
        reply.status(204).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

// Rotas para Pedidos
server.post("/pedido", async (request, reply) => {
    try {
        const { quant, status, datapedid, valor_total, desc_pedido, pratosid, id_comanda_num } = request.body;
        await database.createPedido({ quant, status, datapedid, valor_total, desc_pedido, pratosid, id_comanda_num });
        reply.status(201).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

server.get("/pedido", async (request) => {
    try {
        const search = request.query.search || '';
        const pedidos = await database.listPedidos(search);
        return pedidos;
    } catch (error) {
        return { error: error.message };
    }
});

server.put("/pedido/:id", async (request, reply) => {
    try {
        const pedidoID = request.params.id;
        const { quant, status, datapedid, valor_total, desc_pedido, pratosid } = request.body;

        // Verificar se o pedido existe
        const pedidoExistente = await database.getPedidoById(pedidoID);
        if (!pedidoExistente) {
            return reply.status(404).send({ error: "Pedido não encontrado" });
        }

        await database.updatePedido(pedidoID, { quant, status, datapedid, valor_total, desc_pedido, pratosid });
        reply.status(204).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

server.delete("/pedido/:id", async (request, reply) => {
    try {
        const pedidoID = request.params.id;

        // Verificar se o pedido existe
        const pedidoExistente = await database.getPedidoById(pedidoID);
        if (!pedidoExistente) {
            return reply.status(404).send({ error: "Pedido não encontrado" });
        }

        await database.deletePedido(pedidoID);
        reply.status(204).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});
// Rota de Login
server.post("/login", async (request, reply) => {
    try {
        const { nome, gmail, whats } = request.body;
        const usuario = await database.loginCliente(gmail, nome, whats);
        if (usuario) {
            reply.status(200).send({ message: "Login bem-sucedido", usuario });
        } else {
            reply.status(401).send({ message: "Credenciais inválidas" });
        }
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

// Rotas para Restaurantes
server.post("/restaurante", async (request, reply) => {
    try {
        const { cnpj, nome, endereco, cep, cidade, bairro, num, compl, telefone, capacidade } = request.body;
        await database.createRestaurante({ cnpj, nome, endereco, cep, cidade, bairro, num, compl, telefone, capacidade });
        reply.status(201).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

server.get("/restaurante", async (request) => {
    try {
        const search = request.query.search || '';
        const restaurante = await database.listRestaurante(search);
        return restaurante;
    } catch (error) {
        return { error: error.message };
    }
});

server.put("/restaurante/:id", async (request, reply) => {
    try {
        const restID = request.params.id;
        const { cnpj, nome, endereco, cep, cidade, bairro, num, compl, telefone, capacidade } = request.body;
        await database.updateRestaurante(restID, { cnpj, nome, endereco, cep, cidade, bairro, num, compl, telefone, capacidade });
        reply.status(204).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

server.delete("/restaurante/:id", async (request, reply) => {
    try {
        const restID = request.params.id;
        await database.deleteRestaurante(restID);
        reply.status(204).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

// Iniciar o servidor
const start = async () => {
    try {
        await server.listen({ port: 3333 });
        console.log(`Server listening at http://localhost:3333`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
