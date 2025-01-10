import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

class ProductManager {
	constructor(path) {
		this.path = path
	}

	async getAll() {
		try {
			if (fs.existsSync(this.path)) {
				const products = await fs.promises.readFile(this.path, "utf-8")
				if(products){
					return JSON.parse(products)
				}else{
					return []
				}
			} else return []
		} catch (error) {
			throw new Error(`Ocurrio un error de lectura en archivo de productos: ${error.message}`)
		}
	}

	async create(obj) {
		try {

			const { title, description, code, price, stock, category } = obj
			if (!title || !description || !code || !price || !stock || !category) { //verifico los campos requeridos
				throw new Error('Todos los campos son obligatorios, excepto las imagenes.')
			}
			const status = obj.status !== undefined ? obj.status : true //si se omite status lo agrego con valor true
			const product = {
				id: uuidv4(),
				title,
				description,
				code,
				price,
				status,
				stock,
				category,
				thumbnails: obj.thumbnails || [],
			}

			const products = await this.getAll()
			products.push(product)
			await fs.promises.writeFile(this.path, JSON.stringify(products))
			return product
		} catch (error) {
			throw new Error(error)
		}
	}

	async getById(id) {
		try {
			const products = await this.getAll()
			const product = products.find((product) => product.id === id)
			if (!product) throw new Error(`Producto no encontrado ${id}`)
			return product
		} catch (error) {
			throw new Error(error.message)
		}
	}

	async update(obj, id) {
		try {
			const products = await this.getAll()
			let prod = await this.getById(id)
			prod = { ...prod, ...obj }
			const newArray = products.filter((prod) => prod.id !== id)
			newArray.push(prod)
			await fs.promises.writeFile(this.path, JSON.stringify(newArray))
			return prod
		} catch (error) {
			throw new Error(error)
		}
	}

	async delete(id) {
		try {
			const prod = await this.getById(id)
			const products = await this.getAll()
			const newArray = products.filter((prod) => prod.id !== id)
			await fs.promises.writeFile(this.path, JSON.stringify(newArray))
			return prod
		} catch (error) {
			throw new Error(error)
		}
	}

	async deleteAll() {
		try {
			const products = await this.getAll()
			if (!products.length > 0) throw new Error("No hay productos")
			await fs.promises.unlink(this.path)
		} catch (error) {
			throw new Error(error)
		}
	}
}

export const prodManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"))
