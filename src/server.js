import express from "express"
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"
import homeRoute from './routes/home.router.js'
import realTimeProducts from './routes/realtimeproducts.router.js'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import { prodManager } from './managers/product.manager.js'
const app = express()
const port = 8080

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use('/home', homeRoute)
app.use('/realtimeproducts', realTimeProducts)

const httpServer = app.listen(8080,()=>{
    console.log(`Servidor escuchando en ${port}`)
})

export const socketServer = new Server(httpServer)

// rutas que tengan que ver con productos

socketServer.on('connection', async (socket)=>{
    console.log(`Nuev.Disp.Conect. ID: ${socket.id}`)
    const productsList = await prodManager.getAll()
    socket.emit('home', productsList)
    socket.emit('realtime', productsList)
    socket.on('nuevo-producto', async(producto)=>{
        try{
            await prodManager.create(producto)
            const productsList = await prodManager.getAll()
            socketServer.emit('realtime', productsList) // emite a todos los sockets el evento realtime junto a la lista actualizada
        }catch (error){
            console.log(error.message)
            socket.emit('error', error.message);
        }
    })
    socket.on('update-producto', async (producto)=>{
        try{
            await prodManager.update(producto, producto.id)
            const productsList = await prodManager.getAll()
            socketServer.emit('realtime',productsList)
        }catch (error){
            console.log(error.message)
            socket.emit('error', error.message);
        }
    })
    socket.on('delete-producto', async(id) => {
        try{
            console.log(`Intento borrar id: ${id}`)
            await prodManager.delete(id)
            const productsList = await prodManager.getAll()
            socketServer.emit('realtime', productsList)
        }catch (error){
            console.log(error.message)
            socket.emit('error', error.message);
        }
        
    })
})
