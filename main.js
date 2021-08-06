const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000

app.use(express.static('public'))

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/')
})

clients = []

io.on('connection', (socket) => {
    clients.push({'id': socket.id, 'location': []})

    console.log(socket.id + " has connected.")

    var index
    for (let i=0; i<clients.length; i++) {
        if (clients[i]['id'] == socket.id) {
            index = i
        }
    }

    socket.on("ping", (data) => {
        clients[index]['location'][0] = data.latitude
        clients[index]['location'][1] = data.longitude
        console.log("Ping from " + socket.id)
    })

    socket.on("give", () => {
        for (let i=0; i<clients.length; i++) {
            if (clients[i]['id'] != socket.id) {
                if (Math.round(clients[i]['location'][0]) == Math.round(clients[index]['location'][0])) {
                    if (Math.round(clients[i]['location'][1]) == Math.round(clients[index]['location'][1])) {
                        io.to(clients[i]['id']).emit("received")
                        io.to(clients[index]['id']).emit("give")
                        console.log("Fire has been exchanged.")
                    }
                }
            }
        }
    })

    socket.on('ring', function (fn) {
        fn()
    })

    socket.on("disconnect", () => {
        clients.splice(index, 1)
        console.log(socket.id + " has disconnected.")
    })
})

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`)
})