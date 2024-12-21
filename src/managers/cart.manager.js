import fs from 'fs'
import { prodManager } from './product.manager.js'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

class CartManager {
    constructor(path) {
        this.path = path
    }

    async getAllCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, "utf-8")
                const cartsJSON = JSON.parse(carts)
                return cartsJSON
            } else {
                return []
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async createCart() {
        try {
            const cart = {
                id: uuidv4(),
                products: [],
            }
            const cartsFile = await this.getAllCarts()
            cartsFile.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile))
            return cart
        } catch (error) {
            throw new Error(`Error a crear carrito: ${error}`)
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getAllCarts()
            return carts.find((c) => c.id === id)
        } catch (error) {
            throw new Error(error)
        }
    }

    async saveProdToCart(idCart, idProd) {
        try {
            const prodExists = await prodManager.getById(idProd)
            if (!prodExists) throw new Error('No existe el producto requerido')
            let cartsFile = await this.getAllCarts()
            const cartExists = await this.getCartById(idCart)
            if (!cartExists) throw new Error('No existe el carrito')

            const existsProdInCart = cartExists.products.find((prod) => prod.id === idProd)
            if (!existsProdInCart) {
                const product = {
                    id: idProd,
                    quantity: 1
                }
                cartExists.products.push(product)
            } else {
                existsProdInCart.quantity += 1
                if(existsProdInCart.quantity > prodExists.stock) throw new Error('No hay stock suficiente del producto')
            }
            
            const updatedCarts = cartsFile.map((cart) => {
                if (cart.id === idCart) return cartExists // pisa el carrito existente.
                return cart
            })

            await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts))
            return cartExists
        } catch (error) {
            throw new Error(error)
        }
    }
}

export const cartManager = new CartManager(
    path.join(process.cwd(), "src/data/carts.json")
)
