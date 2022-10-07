import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low, JSONFile } from 'lowdb'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import sha1 from 'sha1'
import bcrypt from 'bcrypt'
import { User } from './src/store/actions/auth'

dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(__dirname, 'public')))
app.use(express.static(join(__dirname, 'dist')))
app.get('/', (req, res) => {
	res.sendFile(join(__dirname, 'dist', 'index.html'))
})

export type Databaseschema = {
	users: User[]
}

const file = join(__dirname, 'data/users.json')
const adapter = new JSONFile<Databaseschema>(file)
const db = new Low(adapter)
db.read()

const authenticateUser = (req, res, next) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if (token == null) return res.sendStatus(401)
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403)

		req.user = { ...user, password: '', salt: '' }
		next()
	})
}

app.get('/auth/me', authenticateUser, (req, res) => {
	res.json(req.user)
})

app.post('/auth/register', async (req, res) => {
	const { email, password, firstName, lastName, birthdate, company, eyeColor, phone, address } =
		req.body

	const user: User = {
		_id: uuidv4(),
		guid: uuidv4(),
		isActive: true,
		balance: '$0.00',
		picture: 'http://placehold.it/32x32',
		age: moment().diff(birthdate, 'years'),
		name: {
			first: firstName,
			last: lastName,
		},
		email,
		password,
		company,
		eyeColor,
		phone,
		address,
		salt: '',
	}

	const existingUser = db.data?.users.find(u => u.email === email)
	if (existingUser) {
		return res.status(400).json({ message: 'User already exists' })
	}

	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt
		.hash(sha1(password), salt)
		.then(hash => {
			user.password = hash
			user.salt = salt
			db.data?.users.push(user)
			db.write()

			const token = jwt.sign(user, process.env.JWT_SECRET, {
				expiresIn: '1h',
			})
			req.user = { ...user, password: '', salt: '' }
			res.json({ token, user: { ...user, password: '', salt: '' } })
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ message: 'Something went wrong' })
		})
})

app.post('/auth/login', async (req, res) => {
	const { email, password } = req.body
	const user = db.data?.users.find(u => u.email === email)
	if (!user) {
		return res.status(400).json({ message: 'User not found' })
	}

	const isPasswordCorrect = bcrypt.compareSync(sha1(password), user.password)
	if (!isPasswordCorrect) {
		return res.status(400).json({ message: 'Invalid password' })
	}

	const token = jwt.sign(user, process.env.JWT_SECRET, {
		expiresIn: '1h',
	})

	res.json({ token, user: { ...user, password: '', salt: '' } })
})

app.get('/users', authenticateUser, (req, res) => {
	const { page = 1, limit = 10 } = req.query
	const startIndex = (page - 1) * limit
	const endIndex = page * limit
	const results: any = {}

	if (db.data && db.data.users) {
		if (endIndex < db.data.users.length) {
			results.next = {
				page: page + 1,
				limit: limit,
			}
		}
	}

	if (startIndex > 0) {
		results.previous = {
			page: page - 1,
			limit: limit,
		}
	}

	results.results = db.data?.users.slice(startIndex, endIndex).map(result => {
		return { ...result, password: '', salt: '' }
	})

	res.json(results)
})

app.get('/users/:id', authenticateUser, (req, res) => {
	const user = db.data?.users.find(u => u._id === req.params.id)
	if (!user) {
		return res.status(400).json({ message: 'User not found' })
	}

	res.json({ ...user, password: '', salt: '' })
})

app.put('/users/:id', authenticateUser, async (req, res) => {
	const user = db.data?.users.find(u => u._id === req.params.id)
	if (!user) {
		return res.status(400).json({ message: 'User not found' })
	}

	const { email, password, firstName, lastName, birthdate, company, eyeColor, phone, address } =
		req.body

	user.email = email
	user.password = password
	user.name.first = firstName
	user.name.last = lastName
	user.age = moment().diff(birthdate, 'years')
	user.company = company
	user.eyeColor = eyeColor
	user.phone = phone
	user.address = address

	await db.write()

	req.user = user
	res.json({ ...user, password: '', salt: '' })
})

app.delete('/users/:id', authenticateUser, async (req, res) => {
	const user = db.data?.users.find(u => u._id === req.params.id)
	if (!user) {
		return res.status(400).json({ message: 'User not found' })
	}

	if (db.data) {
		db.data.users = db.data?.users.filter(u => u._id !== req.params.id)
		await db.write()
		res.json({ message: 'User deleted' })
	}

	res.status(500).json({ message: 'Something went wrong' })
})

app.post('/auth/logout', (req, res) => {
	res.json({ message: 'User logged out' })
})

app.listen(5001, () => {
	console.log('Server started on port 5001')
})
