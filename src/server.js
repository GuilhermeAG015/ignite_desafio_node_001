import http from 'node:http'

const server = http.createServer(async (req, res) => {
  return res.writeHead(404).end('Not Found')
})

server.listen(3001, () => {
  console.info('Server is running on port 3001')
})
