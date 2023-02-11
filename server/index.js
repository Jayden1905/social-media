import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import e from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import morgan from 'morgan'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { register } from './controllers/auth.js'
import { createPost } from './controllers/posts.js'
import { verifyToken } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import { userRoutes } from './routes/users.js'

/* Configuration */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const app = e()

app.use(e.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', e.static(path.join(__dirname, 'public/assets')))

/* File storage */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'public/assets')
  },

  filename: (_req, file, cb) => {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

/* Routes with files */
app.post('/auth/register', upload.single('picture'), register)
app.post('/posts/', verifyToken, upload.single('picture'), createPost)

/* Routes */
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

/* Mongoose Setup */
const PORT = process.env.PORT || 6001

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message))

app.get('/api/hello', (_req, res) => {
  res.send('Hello to Social Media API')
})
