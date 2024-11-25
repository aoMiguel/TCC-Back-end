import fastify from 'fastify';
import { DataBasePostgres } from './database-postgres.js';
import cors from 'fastify-cors';
import {sql} from './db.js'; 
import jwt from 'jsonwebtoken';
const database = new DataBasePostgres();
const server = fastify();

// Configuração do CORS
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
    const { nome, gmail, whats } = request.body;
    console.log('Dados recebidos:', { nome, gmail, whats });

    try {
        const existingClient = await sql`SELECT * FROM cliente WHERE gmail = ${gmail} OR whats = ${whats}`;
        
        if (existingClient.length > 0) {
            return reply.status(400).send({ error: 'Cliente já cadastrado com este email ou telefone.' });
        }

        const result = await sql`INSERT INTO cliente (nome, gmail, whats) VALUES (${nome}, ${gmail}, ${whats})`;

        // Gerar um token
        const token = jwt.sign({ gmail }, '067773201a', { expiresIn: '1h' }); 
        reply.send({ success: true, token });
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        reply.status(500).send({ error: 'Erro ao cadastrar cliente' });
    }
});

server.get("/cliente", async (request) => {
    try {
        const clientes = await sql`SELECT * FROM cliente`;
        return clientes;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return { error: error.message };
    }
});

server.put("/cliente/:id", async (request, reply) => {
    try {
        const usuarioID = request.params.id;
        const { nome, gmail, whats } = request.body;

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
        const { gmail } = request.body;
        
        // Verifique se o cliente existe usando o gmail
        const usuario = await sql`SELECT * FROM cliente WHERE gmail = ${gmail}`;
        
        if (usuario.length > 0) {
            const token = jwt.sign({ gmail: usuario[0].gmail }, '067773201a', { expiresIn: '1h' });
            reply.status(200).send({ message: "Login bem-sucedido", token });
        } else {
            reply.status(401).send({ message: "Credenciais inválidas" });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        reply.status(500).send({ error: 'Erro ao fazer login' });
    }
});

// Rotas para Restaurantes
    server.post("/restaurante", async (request, reply) => {
        const { cnpj, nome, endereco, cep, cidade, bairro, num, compl, telefone, capacidade } = request.body;
    
        try {
            await database.createRestaurante({ cnpj, nome, endereco, cep, cidade, bairro, num, compl, telefone, capacidade });
            reply.status(201).send();
        } catch (error) {
            reply.status(500).send({ error: error.message });
        }
    });

server.get("/restaurante", async (request) => {
    try {
        const restaurante = await database.listRestaurante();
        return restaurante;
    } catch (error) {
        return { error: error.message };
    }
});

server.put("/restaurante/:id", async (request, reply) => {
    try {
        const restauranteID = request.params.id;
        const { cnpj, nome, endereco, cep, cidade, bairro, num, compl, telefone, capacidade } = request.body;

        const restauranteExistente = await database.getRestauranteById(restauranteID);
        if (!restauranteExistente) {
            return reply.status(404).send({ error: "Restaurante não encontrado" });
        }

        await database.updateRestaurante(restauranteID, { cnpj, nome, endereco, cep, cidade, bairro, num, compl, telefone, capacidade });
        reply.status(204).send();
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

server.delete("/restaurante/:id", async (request, reply) => {
    try {
        const restauranteID = request.params.id;

        const restauranteExistente = await database.getRestauranteById(restauranteID);
        if (!restauranteExistente) {
            return reply.status(404).send({ error: "Restaurante não encontrado" });
        }

        await database.deleteRestaurante(restauranteID);
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
