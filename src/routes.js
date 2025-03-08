import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/buildRoutePath.js'
import { formatDate } from './utils/formatDate.js'

const database = new Database

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const formattedDate = formatDate()

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
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body
      const formattedDate = formatDate()

      const hasIdOnDatabase = database.findById('tasks', id)

      if (hasIdOnDatabase) {
        database.update('tasks', id, {
          title,
          description,
          updated_at: formattedDate
        })
        
        return res
          .writeHead(204)
          .end()
      }
      return res
        .writeHead(404)
        .end('Id not found')
    }
  }
]