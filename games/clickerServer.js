//server
const http = require('http');
const app = require("express")();
app.use(require("express").static(__dirname));
app.get('/', (req, res) => res.sendFile(__dirname + '/clicker.html'));
//the port we actually hold the page
app.listen(5500, () => console.log("Express server running on port 5500"));
const websocketServer = require('websocket').server;
const httpServer = http.createServer();
httpServer.listen(5501, () => console.log("WebSocket server running on port 5501"));

//hashmap of clients (what does this mean?)
const clients = {};
const games = {};

const wsServer = new websocketServer({ 
    //property: 'httpServer',
    "httpServer": httpServer
});

wsServer.on("request", request => {

    //TCB connection --> client connect to server
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!!"));
    connection.on("close", () => console.log("closed!!"));
    connection.on("message", message => {
        //where most o the code will live
        //meaning that "I have received a message from the client"
        //Data that the server will receive, assuming the client is sending JSON data
        //Might cause errors if the client is not sending JSON data
        const result = JSON.parse(message.utf8Data)
        
        //when user clicks on the create button, this will be called
        if(result.method === "create") {
            //ask for client id
            console.log("create game called");
            const clientId = result.clientId;
            const gameId = guid();
            games[gameId] = {
                "id": gameId,
                "scores": { left: 10, right: 10 },
                "clients": []
            };

            const payLoad = {
                "method": "create",
                "game": games[gameId]
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }

        //when user clicks on the join button, this will be called
        if(result.method === "join") {
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            //assign color to the player
            //tell us how many clients there are in the game (at most three clients, or it fails)
            if(game.clients.length >= 2) {
                //max number of clients reached
                return;
            }
            const color = {"0": "Red", "1": "Blue"}[game.clients.length]
            game.clients.push({
                "clientId": clientId,
                "color": color
            })

            //start the game if there are two clients
            if(game.clients.length === 2){
                updateGameState();
            }

            const payLoad = {
                "method": "join",
                "game": game,
            }
            //sent info back to all clients
            //loop through all clients in the game and tell them that a new client has joined
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
            })
        }

        if(result.method === "play") {
            const clientId = result.clientId;
            const gameId = result.gameId;
            const color = result.color;
            let state = games[gameId].state;

            if(!state){
                state = {};
            }

            state[ballId] = color;
            games[gameId].state = state;
        }

        if (result.method === "click") {
            const game = games[result.gameId];
            const side = result.side; // "left" or "right"
            const clientId = result.clientId;
        
            if (!game) return;
        
            const player = game.clients.find(c => c.clientId === clientId);
            if (!player) return;
        
            // Define allowed actions
            const allowed = (side === "left" && player.color === "Red") ||
                            (side === "right" && player.color === "Blue");
        
            if (!allowed) {
                console.log(`Blocked invalid click from ${player.color} on ${side}`);
                return;
            }
        
            if (game.scores && typeof game.scores[side] === 'number') {
                game.scores[side]++;
                const other = side === "left" ? "right" : "left";
                game.scores[other]--;
        
                const payload = {
                    method: "update",
                    game
                };
        
                game.clients.forEach(c => {
                    clients[c.clientId].connection.send(JSON.stringify(payload));
                });
            }
        }
    });

    //generate a new client id for the client
    const clientId = guid();
    //build a mapping between the clientId and the connection
    // might add more to the client object later
    clients[clientId] = {
        "connection": connection,
    }

    const payLoad = {
        "method": "connect",
        "clientId": clientId,
    }

    //send the payLoad as bytes by turning JSON into a string and then sending it
    //send back to the client
    connection.send(JSON.stringify(payLoad));

})


//make a new client id for the client
function S4() {
    //return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return Math.floor(Math.random() * 1000+1000);
}

const guid = () => {
    //return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
    return `${S4()}`;
};

function updateGameState(){
    //a dictionary : {"gameId", (something)}
    for(const g of Object.keys(games)){
        const game = games[g];

        const payLoad = {
            "method": "update",
            "game": game,
        }

        game.clients.forEach(c => {
            clients[c.clientId].connection.send(JSON.stringify(payLoad));
        })
    }

    setTimeout(updateGameState, 500);
}