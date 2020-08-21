const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes")
const cors = require("cors")
const http = require('http')
const { setupWebsocket } = require("./websocket")

const app = express()
const server = http.Server(app)

setupWebsocket(server)

mongoose.connect('mongodb+srv://Diego:rocha030604@cluster0-ubdwk.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Conectado ao mongoDB!")
}).catch((err)=>{
    console.log("Erro ao se conectar ao banco de dados MongoDB! "+err)
})

app.use(cors())
app.use(express.json())
app.use(routes)

const PORTA = 3333
server.listen(PORTA)