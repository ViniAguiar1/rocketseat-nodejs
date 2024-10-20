import http from 'node:http';
import { Transform } from 'node:stream';

class InverseNumberStream extends Transform {
    _transform(chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1;
        console.log(transformed);
        callback(null, Buffer.from(String(transformed)));
    }
}

// req => ReadableStream
// res => WritableStream
const server = http.createServer(async (req, res) => {
    const buffers = []; // Inicialize o array 'buffers'

    for await (const chunk of req) {
        buffers.push(chunk); // Armazene os chunks recebidos
    }

    const fullStreamContent = Buffer.concat(buffers).toString();
    console.log(fullStreamContent); // Exibe o conteúdo completo recebido
    return res.end(fullStreamContent); // Envia o conteúdo completo de volta na resposta
});

server.listen(3334, () => {
    console.log('Server listening on port 3334');
});
