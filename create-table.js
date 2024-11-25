import { sql } from './db.js';

// Tabela Restaurante
await sql`
    CREATE TABLE Restaurante (
        idRestaurante   UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
        cnpj            VARCHAR(255),
        nome            VARCHAR(255),
        endereco        VARCHAR(255),
        cep             VARCHAR(255),
        cidade          VARCHAR(255),
        bairro          VARCHAR(255),
        num             INT,
        compl           VARCHAR(255),
        telefone        VARCHAR(20),
        capacidade      INT
    )
`;
console.log("A tabela Restaurante foi criada com sucesso");

// Tabela Pratos
await sql`
    CREATE TABLE Pratos (
        pratosid    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        TEXT,
        description TEXT,
        price       DECIMAL(10, 2),
        foto        TEXT
    )
`;
console.log("A tabela Pratos foi criada com sucesso!");

// Tabela Comanda
await sql`
    CREATE TABLE Comanda (
        IDcomanda_num   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuarioid       UUID,
        pratosid        UUID,
        idRestaurante   UUID,
        FOREIGN KEY (idRestaurante) REFERENCES Restaurante(idRestaurante),  
        FOREIGN KEY (pratosid) REFERENCES Pratos(pratosid)
    )
`;
console.log("A tabela Comanda foi criada com sucesso");

// Tabela Cliente
await sql`
    CREATE TABLE Cliente (
        usuarioid        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        idComanda        UUID,
        idRestaurante    UUID,
        nome             TEXT,  
        gmail            VARCHAR(255),
        whats            VARCHAR(20),
        FOREIGN KEY (idRestaurante) REFERENCES Restaurante(idRestaurante), 
        FOREIGN KEY (idComanda) REFERENCES Comanda(IDcomanda_num)
    )
`;
console.log('A tabela Cliente foi criada com sucesso!');

// Tabela Pedido
await sql`
    CREATE TABLE Pedido (
        pedidoID         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quant            INT,
        status           CHAR(1),
        datapedid        TIMESTAMP,
        valor_total      DECIMAL(10, 2),
        desc_pedido      VARCHAR(255),
        pratosid         UUID,
        id_comanda_num   UUID,
        idRestaurante    UUID,
        FOREIGN KEY (pratosid) REFERENCES Pratos(pratosid),  
        FOREIGN KEY (id_comanda_num) REFERENCES Comanda(IDcomanda_num),  
        FOREIGN KEY (idRestaurante) REFERENCES Restaurante(idRestaurante) 
    )
`;

console.log("A tabela Pedido foi criada com sucesso! Seja feliz, deu certo!");





