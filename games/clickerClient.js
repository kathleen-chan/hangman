//HTML elements
let clientId = null;
let gameId = null;
let playerColor = null;

let ws = new WebSocket("ws://localhost:5501")
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const divPlayers = document.getElementById("divPlayers");
const divGameId = document.getElementById("divGameId");
const container = document.getElementById("container");
const spnLeft = document.getElementById("spnLeft");
const spnRight = document.getElementById("spnRight");


//wiring events
btnJoin.addEventListener("click", e => {

    if (gameId === null)
        gameId = txtGameId.value;
    
    const payLoad = {
        "method": "join",
        "clientId": clientId,
        "gameId": gameId
    }

    container.style.display = "flex";
    divGameId.textContent = "The game id is " + gameId;
    ws.send(JSON.stringify(payLoad));

})

btnCreate.addEventListener("click", e => {

    const payLoad = {
        "method": "create",
        "clientId": clientId
    }

    ws.send(JSON.stringify(payLoad));

})

spnLeft.addEventListener("click", () => {
    const payLoad = {
      method: "click",
      clientId,
      gameId,
      side: "left"
    };

    ws.send(JSON.stringify(payLoad));
});

spnRight.addEventListener("click", () => {
    const payLoad = {
      method: "click",
      clientId,
      gameId,
      side: "right"
    };

    ws.send(JSON.stringify(payLoad));
});

ws.onmessage = message => {
    //message.data
    const response = JSON.parse(message.data);
    //connect
    if (response.method === "connect"){
        clientId = response.clientId;
        console.log("Client id set successfully " + clientId)
    }

    //create
    if (response.method === "create"){
        gameId = response.game.id;
        console.log("game successfully created with id " + response.game.id)  
    }


    //update
    if (response.method === "update") {
        document.getElementById("leftScore").textContent = response.game.scores.left;
        document.getElementById("rightScore").textContent = response.game.scores.right;

        spnLeft.style.flex = response.game.scores.left;
        spnRight.style.flex = response.game.scores.right;
    }

    //join
    if (response.method === "join") {
        const game = response.game;
    
        while (divPlayers.firstChild) divPlayers.removeChild(divPlayers.firstChild);
    
        game.clients.forEach(c => {
            const d = document.createElement("div");
            d.style.width = "200px";
            d.style.background = c.color;
            d.textContent = c.clientId;
            divPlayers.appendChild(d);
    
            if (c.clientId === clientId) {
                playerColor = c.color;
    
                // Disable the opposite side
                if (playerColor === "Red") {
                    spnRight.style.pointerEvents = "none";
                    spnRight.style.opacity = "0.5";
                } else if (playerColor === "Blue") {
                    spnLeft.style.pointerEvents = "none";
                    spnLeft.style.opacity = "0.5";
                }
            }
        });
    }
}