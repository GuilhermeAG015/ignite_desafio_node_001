import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/buildRoutePath.js'

const database = new Database

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)
      
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const date = new Date()
      const formattedDate = date.toLocaleString()

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: formattedDate,
        updated_at: formattedDate,
      }
  
      database.insert('tasks', task)

      return res
        .writeHead(201)
        .end()
    }
  },
]