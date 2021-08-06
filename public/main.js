
function giveFire() {
    document.getElementById("flame").classList.add("in")
}

window.onload = () => {
    socket = io()

    // give current location
    navigator.geolocation.getCurrentPosition((position) => {
        var latitude = position['coords']['latitude']
        var longitude = position['coords']['longitude']

        socket.emit("ping", {'latitude': latitude, 'longitude': longitude})
    })

    var torch = document.getElementById("torch")
    var flame = document.getElementById("flame")
    var status = document.getElementById('status')

    

    var start = Date.now();
    socket.emit('ring', function clientCallback() {
        console.log( 'Websocket RTT: ' + (Date.now() - start) + ' ms' );
    });

    if (!navigator.geolocation) {
        alert("Geolocation is not supported on this device, please switch to another device/browser")
        window.close()
    }

    var pinging = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            var latitude = position['coords']['latitude']
            var longitude = position['coords']['longitude']

            socket.emit("ping", {'latitude': latitude, 'longitude': longitude})
        })
    }, 60000)

    

    socket.on("received", () => {
        if (flame.classList.contains("out")) {
            flame.classList.remove("out")
        }
        if (!flame.classList.contains("in")) {
            flame.classList.add("in")
        }
    })

    socket.on("give", () => {
        if (flame.classList.contains("in")) {
            flame.classList.remove("in")
        }
        if (!flame.classList.contains("out")) {
            flame.classList.add("out")
        }
    })

    torch.addEventListener("click", () => {
        if (flame.classList.contains("in")) {
            socket.emit('give')
        }
    })
}