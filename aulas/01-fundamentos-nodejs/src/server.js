import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'

// Formas do front-end enviar informações ao backend 

// Query Parameters: http://localhost:3333/users?userId=1&name=Vinicius ==> URL Stateful => Muito utilizado em filtros, paginação, e que acaba não sendo obrigatórios

// Route Parameters: GET => http://localhost:3333/users/1 (parametros não nomeados) ==> Identificação de recurso

// Request Body: Envio de informações, normalmente para envio de formulário (HTTPs)

const server = http.createServer(async(req, res) => {
     const { method, url } =  req

     await json(req, res)

     const route = routes.find(route => {
          return route.method === method && route.path === url
     })

     if(route){
          return route.handler(req, res)
     }

     return res.writeHead(404).end()
})

server.listen(3333)
