import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  async #persist() {
    await fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  #rowIndex(table, id) {
    return this.#database[table].findIndex(row => row.id === id)
  }

  findById(table, id) {
    if (this.#rowIndex(table, id) > -1) {
      return true
    }
    return false
  }

  update(table, id, data) {
    const rowIndex = this.#rowIndex(table, id)

    if (rowIndex > -1) {
      const d = this.#database[table][rowIndex]
      this.#database[table][rowIndex] = {
        id,
        title: data.title,
        description: data.description,
        completed_at: d.completed_at,
        created_at: d.created_at,
        updated_at: data.updated_at
      }
      this.#persist()
    }
  }

  delete(table, id) {
    const rowIndex = this.#rowIndex(table, id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}