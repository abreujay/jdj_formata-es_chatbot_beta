const express = require('express');
const wa = require('@open-wa/wa-automate');
require('dotenv').config()

const PORT = process.env.PORT || 3000;

const app = express();
app.listen(PORT, async () => {
    console.log('Servidor rodando na porta', PORT);

    try {
        let blockedNumber = new Set();
        let first = true;

        const start = (client) => {
            client.onMessage(async message => {
                const response = message.body.toLowerCase();

                if (blockedNumber.has(message.from)) {
                    return; 
                }

                if (first === true) {
                    await client.sendText(message.from, 'JDJ Formatações agradece o seu contato! Com qual das opções podemos ajudar?\n 1. Quero formatar meu dispositivo\n  2. Dúvidas\n 3. Falar com o especialista');
                    first = false;
                } else {
                    switch (response) {
                        case '1':
                            await client.sendText(message.from, 'Perfeito! Por favor aguarde... Um especialista entrará em contato para mais detalhes sobre sua formatação. :)');
                            break;
                        case '2':
                            await client.sendText(message.from, 'Entendi, em breve um especialista entrará em contato! Enquanto isso, poderia especificar melhor qual seria sua dúvida?');
                            break;
                        case '3':
                            await client.sendText(message.from, 'Entendi! Estou transferindo para um especialista... Enquanto isso, poderia nos fornecer mais detalhes referente a sua dúvida ou problema?');
                            break;
                        default:
                            await client.sendText(message.from, 'Não entendi, por favor, selecione uma das opções');
                            return; 
                    }

                    blockedNumber.add(message.from);
                    setTimeout(() => {
                        blockedNumber.delete(message.from);
                        first = true; 
                    }, 2 * 60 * 60 * 1000);
                }
            });
        };

        const client = await wa.create();
        console.log('Cliente conectado com sucesso');
        start(client);

    } catch (error) {
        console.error('Ocorreu um erro ao conectar cliente', error);
    }
});
