"use strict";

// Players' elements:
const botCounter = document.querySelector(".bot-counter");
const userCounter = document.querySelector(".user-counter");
const botDeck = document.querySelector(".bot-deck");
const userDeck = document.querySelector(".user-deck");
let cards = document.querySelectorAll(".card");
let nextTurn = "user";
let round = 1;

// Buttons:
const envidoButton = document.querySelector(".envido");
const realEnvidoButton = document.querySelector(".real-envido");
const faltaEnvidoButton = document.querySelector(".falta-envido");
const trucoButton = document.querySelector(".truco");
const retrucoButton = document.querySelector(".retruco");
const valeCuatroButton = document.querySelector(".vale-cuatro");
const replayButton = document.querySelector(".play-again");

// Modal elements:
const modalMessage = document.querySelector(".modal-message");
const modalTitle = document.querySelector(".modal-message__title");
const modalMessageMsg = document.querySelector(".modal-message__message-stage");

const randomNumber = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Card {
    static deck = [];

    constructor(card = null, player) {
        this.card = card;
        this.player = player;
    }
    
    getCardName = () => this.card;

    getCard = () => {
        if(Card.deck.length === 0) 
            Card.createDeck();
        return Card.deck.pop();
    }

    addCard = (cardElement) => {
        this.player === "bot" ?  
            botDeck.appendChild(cardElement) :
            userDeck.appendChild(cardElement);
    }

    static shuffleDeck = (deck) => {
        for(let last = deck.length - 1; last > 0; last--) {
            const random = randomNumber(0, last);
            [deck[last], deck[random]] = [deck[random], deck[last]];
        }
    }

    static createDeck = () => {
        const suits = ["basto", "oro", "espada", "copa"];
        Card.deck = [];

        for(let num = 2; num <= 12; num++) { 
            if(num == 8 || num == 9)
                continue;
            
            for(const suit of suits) {
                const cardValue = num.toString(); 
                Card.deck.push(`${cardValue}-${suit}`);
            }
        }

        Card.shuffleDeck(Card.deck); 
    }

    createCard = (add, className) => {
        const cardName = this.card || this.getCard();
        const [name, suit] = cardName.split('-');
        this.card = cardName;

        let cardElement = document.createElement("IMG"); 
        cardElement.src = `../../src/assets/spanishDeck/${cardName}.jpg`;
        cardElement.classList.add(className);
        cardElement.classList.add(this.player);
        cardElement.alt = (name === "BACK" ? 
            "Carta dada vuelta de baraja española" : 
            `Carta ${name} ${suit} de baraja española`
        );
        cardElement.title = (name === "BACK" ? 
            "Carta del bot" :
            `${name} de ${suit}`
        );

        if(cardName === "BACK")
            cardElement.classList.add("turnedOver");
        
        if(add)
            this.addCard(cardElement);
        else 
            return cardElement;
    }
}

class Player {
    constructor(player) {
        this.typePlayer = player;
        this.score = 0;
        this.deck = [];
        this.droppedCards = [];
    }

    getDeck  = () => this.deck;

    getDroppedCards = () => this.droppedCards;

    getScore = () => this.score;

    updateScore = (newPoints) => {
        this.score = Math.min(30, newPoints);
        this.typePlayer == "user" ? 
            userCounter.textContent = this.score :
            botCounter.textContent  = this.score;
    }

    addCard = (card, player) => {
        const currentCard = new Card(card, player);
        currentCard.createCard(true, "card");
        if(player == "bot") {
            const newCard = new Card("", "bot");
            newCard.createCard(false, "card");
            this.deck.push(newCard.getCardName());
        } else
            this.deck.push(currentCard.getCardName());
    }

    getEnvidoScore = () => {
        const deck = this.deck;
        
        const suits = new Map();
        deck.forEach((card) => {
            const [num, suit] = card.split('-');
            if(!suits.has(suit)) {
                suits.set(suit, []);
            }
            suits.get(suit).push(num);
        });
        
        let score = 0;
        suits.forEach((cards, suit) => {
            if(cards.length >= 2) {
                score = 20;
                cards.forEach((num) => {
                    num = parseInt(num);
                    if(num == 12 || num == 11 || num == 10) 
                        return;
                    score += num;
                });
            } else {
                if(cards[0] == 12 || cards[0] == 11 || cards[0] == 10) 
                    return;
                score = Math.max(score, cards[0]);
            }
        });
        
        return score;
    }
}

class Truco {
    constructor(user, bot) {
        this.user = user;
        this.bot = bot;
        this.winner = null;
        this.loser = null;
        this.lead = "user";
        this.botRoundsWins = 0;
        this.userRoundsWins = 0;
        this.firstRoundWinner = "";
        this.lastWinner = "";
    }

    getWinner = () => this.winner;
    
    clearDeck = () => {
        const playersDeck = document.querySelectorAll(".card");
        const droppedCards = document.querySelectorAll(".dropped-card");
        for(let card of playersDeck) 
            card.remove();
        for(let card of droppedCards) 
            card.remove();
    }

    startGame = () => {
        for(let cardsAmount = 1; cardsAmount <= 3; cardsAmount++) {
            this.bot.addCard("BACK", this.bot.typePlayer);
            this.user.addCard(null,  this.user.typePlayer);
        }

        this.user.updateScore(0);
        this.bot.updateScore(0);
        bot.deck = [...this.bot.getDeck()];

        cards = document.querySelectorAll(".card");
        
        if(nextTurn.trim().length === 0)
            nextTurn = "user";
        else 
            nextTurn = (this.lastRoundWinner == "user" ? "bot" : "user");

        this.userThrowCard();
    }

    startAnotherRound = () => {
        envidoButton.classList.remove("disabled");
        trucoButton.classList.remove("disabled");
        replayButton.classList.remove("disabled");
        this.bot.deck = [];
        this.user.deck = [];
        this.clearDeck();
        alert("Ronda terminada");

        for(let cardsAmount = 1; cardsAmount <= 3; cardsAmount++) {
            this.bot.addCard("BACK", this.bot.typePlayer);
            this.user.addCard(null,  this.user.typePlayer);
        }
        bot.deck = [...this.bot.getDeck()];
        this.botRoundsWins = 0;
        this.userRoundsWins = 0;
        this.firstRoundWinner = "";
        this.bot.droppedCards = [];
        this.user.droppedCards = [];
        this.lead = this.lastWinner;
        trucoPoints = 1;
        cards = document.querySelectorAll(".card");
        
        nextTurn = this.lastWinner;
        if(nextTurn == "user") {
            this.userThrowCard();
        } else {
            bot.askEnvido();
            this.userThrowCard();
        }
    }

    endGame = () => {}

    gameStageModal = (title, raised) => {
        const wantedButton = document.querySelector(".wanted");
        const rejectedButton = document.querySelector(".rejected");
        const raiseButton = document.querySelector(".raise");
        const closeButton = document.querySelector(".close");
        wantedButton.style.display = "inline-block";
        rejectedButton.style.display = "inline-block";
        raiseButton.style.display = "inline-block";
        closeButton.style.display = "none";

        wantedButton.addEventListener("click", () => {
            let points = 0;
            switch(title.toLowerCase()) {
                case "envido":
                    points = 2;
                    this.determineEnvidoWinner(points, "", false);
                    break;
                case "real envido":
                    points = raised ? 2 + 3 : 3;
                    this.determineEnvidoWinner(points, "", false);
                    break;
                case "falta envido":
                    const missingPoints = 30 - this.bot.getScore();
                    points = raised ? 2 + 3 + missingPoints : missingPoints;
                    this.determineEnvidoWinner(points, "", false);
                    break;
                case "truco":
                    trucoPoints = 2;
                    this.determineTrucoWinner(points, "", false);
                    break;
                case "retruco":
                    trucoPoints = 3;
                    this.determineTrucoWinner(points, "", false);
                    break;
                case "vale cuatro":
                    trucoPoints = 4;
                    this.determineTrucoWinner(points, "", false);
                    break;
            }
            if(nextTurn == "bot") {
                bot.throwCard();
            }
        });

        rejectedButton.addEventListener("click", () => {
            let points = 0;
            switch(title.toLowerCase()) {
                case "envido":
                    points = 2;
                    this.determineEnvidoWinner(points, "user", true);
                    break;
                case "real envido":
                    points = raised ? 2 + 3 : 3;
                    this.determineEnvidoWinner(points, "user", true);
                    break;
                case "falta envido":
                    const missingPoints = 30 - this.bot.getScore();
                    points = raised ? 2 + 3 + missingPoints : missingPoints;
                    this.determineEnvidoWinner(points, "user", true);
                    break;  
                case "truco":
                    points = 2;
                    if(confirm("¿Estas seguro? Perderás la ronda"))
                        this.determineTrucoWinner("user", true);
                    break;
                case "retruco":
                    points = 2 + 3;
                    if(confirm("¿Estas seguro? Perderás la ronda"))
                        this.determineTrucoWinner("user", true);
                    break;
                case "vale cuatro":
                    points = 2 + 3 + 4;
                    if(confirm("¿Estas seguro? Perderás la ronda"))
                        this.determineTrucoWinner("user", true);
                    break;
            }
            if(nextTurn == "bot") {
                bot.throwCard();
            }
        });
        
        raiseButton.addEventListener("click", () => {
            let titleMessage = modalTitle.textContent.toLowerCase();
            if(titleMessage == "envido") {
                bot.decideEnvido("Real Envido");
            } else if(titleMessage == "real envido") {
                bot.decideEnvido("Falta Envido");
            } else if(titleMessage === "truco") {
                bot.decideTruco("Retruco");
            } else if(titleMessage === "retruco") {
                bot.decideTruco("Vale Cuatro");
            }
        });
    }

    winnerMessage = (message) => {
        // Buttons:
        const wantedButton = document.querySelector(".wanted");
        const rejectedButton = document.querySelector(".rejected");
        const raiseButton = document.querySelector(".raise");
        const closeButton = document.querySelector(".close");

        // Modal elements:
        const modalBackground = document.querySelector(".modal");
        const botEnvidoScore = document.querySelector(".bot-envido-score");
        const playerEnvidoScore = document.querySelector(".player-envido-score");
        const Message = document.querySelector(".envido-message");

        wantedButton.style.display = "none";
        rejectedButton.style.display = "none";
        raiseButton.style.display = "none";
        closeButton.style.display = "inline-block";
        botEnvidoScore.style.display = "inline-block";
        playerEnvidoScore.style.display = "inline-block";

        let flag = false, truco = false;
        let phrase = message.split(" ");
        for(const word of phrase) {
            if(word == "rechazó") {
                flag = true;
                break;
            } else if(word == "rondas") {
                console.log(word); 
                flag = truco = true;
                break;
            }
        }

        Message.textContent = message;
        
        if(!flag) {
            botEnvidoScore.innerHTML = `<strong>Bot:</strong> ${this.bot.getEnvidoScore()}`;
            playerEnvidoScore.innerHTML = `<strong>Jugador:</strong> ${this.user.getEnvidoScore()}`;
        } else {
            botEnvidoScore.style.display = "none";
            playerEnvidoScore.style.display = "none";
        }

        modalBackground.addEventListener("click", () => modalMessage.style.display = "none");
        closeButton.addEventListener("click", () => {
            Message.textContent = "";
            playerEnvidoScore.textContent = "";
            botEnvidoScore.textContent = "";
            modalMessage.style.display = "none";
        });
    }   

    showModal = (title, stageMessage, winnerMessage, raised, gameStage) => {
        modalMessage.style.display = "flex";
        modalMessage.style.justifyContent = "center";
        modalTitle.textContent = title;
        
        const messagesContainer = document.querySelector(".modal-message__messages");
        
        if(winnerMessage.trim().length === 0) {
            modalMessageMsg.style.display = "flex";
            modalMessageMsg.textContent  = stageMessage;
            messagesContainer.style.display = "none";
        } else {
            messagesContainer.style.display = "flex";
            messagesContainer.style.justifyContent = "center"; 
            modalMessageMsg.style.display = "none";
        }

        if(gameStage)
            this.gameStageModal(title, raised);
        else 
            this.winnerMessage(winnerMessage);
    }

    determineHierarchy = (cardName) => {
        const specialCards = {
            "1-espada": 14,
            "1-basto": 13,
            "7-espada": 12,
            "7-oro": 11
        };

        let cardValue = 0, flag = false;
        Object.keys(specialCards).forEach((name, index) => {
            const value = specialCards[name];
            if(!flag && name == cardName) {
                cardValue = value;
                flag = true;
            }
        });

        if(flag) 
            return cardValue;
        
        const cardNumber = cardName.
            split('-').
            filter(value => {
                value = parseInt(value);
                return typeof value === 'number' && isFinite(value);
            });

        const normalCards = {
            "1": 8,
            "2": 9,
            "3": 10,
            "4": 1,
            "5": 2,
            "6": 3,
            "7": 4,
            "10": 5,
            "11": 6,
            "12": 7
        };

        return normalCards[cardNumber] || 0; // 0 en caso de error al pasar un nombre no válido
    }

    determineEnvidoWinner = (points, player, rejected) => {
        if(rejected) {
            this.user.typePlayer != player ? 
                this.user.updateScore(this.user.getScore() + 1) :
                this.bot.updateScore(this.bot.getScore() + 1);
            this.showModal(
                `Pierde el ${player}`,
                "",
                `El ${player} rechazó la apuesta`,
                false,
                false
            );
            return;
        }

        const userScore = this.user.getEnvidoScore();
        const botScore = this.bot.getEnvidoScore();
        
        if(userScore > botScore) {
            this.user.updateScore(this.user.getScore() + points);
            this.showModal(
                "Ganó el jugador",
                "",
                "El envido del jugador es mayor que el del bot",
                false,
                false
            );
        } else if(userScore == botScore) {
            this.lead == "user" ?
                this.user.updateScore(this.user.getScore() + points) : 
                this.bot.updateScore(this.bot.getScore() + points);
            this.showModal(
                "Ganó el jugador",
                "",
                "El envido del jugador es igual que el del bot, pero, gana por ser mano (El primero en jugar)",
                false,
                false
            );
        } else {
            this.bot.updateScore(this.bot.getScore() + points);
            this.showModal(
                "Ganó el bot",
                "",
                "El envido del bot es mayor que el del jugador",
                false,
                false
            );
        }
    }

    determineRoundWinner = () => {
        const userCard = this.user.droppedCards.at(-1);
        const botCard = this.bot.droppedCards.at(-1);
        
        const userCardValue = this.determineHierarchy(userCard);
        const botCardValue = this.determineHierarchy(botCard);
        
        console.log(userCard, botCard);
        if(botCardValue == userCardValue) {
            this.botRoundsWins++;
            this.userRoundsWins++;
        } else if(botCardValue > userCardValue)
            this.botRoundsWins++;
        else    
            this.userRoundsWins++;

        if(round == 1) { 
            this.firstRoundWinner = (this.botRoundsWins != 0 ? 
                "bot" :
                "user"
            );
        } 
            
        if(this.botRoundsWins == 2 || this.userRoundsWins == 2) 
            this.determineTrucoWinner("", false);
        
    }

    determineTrucoWinner = (player, rejected) => {
        if(rejected) {
            this.user.typePlayer == player ? 
                this.user.updateScore(this.user.getScore() + trucoPoints) :
                this.bot.updateScore(this.bot.getScore() + trucoPoints);
            this.showModal(
                `Pierde el ${player}`,
                "",
                `El ${player} rechazó la apuesta`,
                false,
                false
            );
            this.lastWinner = player == "user" ? "bot" : "user";
            return;
        }
        console.log(this.userRoundsWins, this.botRoundsWins);
        if(this.userRoundsWins == 2) {
            this.showModal(
                "El jugador ganó la partida",
                "",
                `El jugador ganó ${this.userRoundsWins} rondas y el bot tan solo ${this.botRoundsWins}`,
                false,
                false
            );
            this.lastWinner = "user";
            this.user.updateScore(this.user.getScore() + trucoPoints);
        } else { 
            this.showModal(
                "El bot ganó la partida",
                "",
                `El bot ganó ${this.botRoundsWins} rondas y el jugador tan solo ${this.userRoundsWins}`,
                false,
                false
            );
            this.lastWinner = "bot";
            this.bot.updateScore(this.bot.getScore() + trucoPoints);
        }
        
        setTimeout(() => this.startAnotherRound(), 1000);
    }

    userThrowCard = () => {
        let askedTruco = false;
        cards.forEach((card, index) => {
            card.addEventListener("click", () => {
                console.log(nextTurn);
                const [cardClassName, playerName] = [...card.classList];
                if(playerName == "bot")
                    return;
    
                const table = document.querySelector(".mesa");
                const userDroppedCards = document.querySelector(".user-dropped-cards");
    
                table.style.display = "flex";
                table.style.flexDirection = "column";   
    
                if(nextTurn == "user") {
                    const cardName = card.title.split(' ').filter((word) => word != "de").join('-');
                    const cardCreator = new Card(cardName, playerName);
                    const cardElement = cardCreator.createCard(false, "dropped-card");
                    userDroppedCards.appendChild(cardElement);
                    card.remove();
                    Game.user.droppedCards.push(cardName);
                    nextTurn = "bot";
                    
                    let checkWinner = false;
                    setTimeout(() => {
                        if(round == 1) {
                            if(!bot.askEnvido()) { 
                                bot.throwCard();        
                                Game.determineRoundWinner();
                                checkWinner = true;
                            }
                        } else {
                            if(!askedTruco)
                                bot.askTruco();
                            bot.throwCard();
                            Game.determineRoundWinner();
                        }
                    }, 300);
                    
                    if(round == 1 && !checkWinner)
                        Game.determineRoundWinner();
                    round++;
    
                    if(round > 1) {
                        envidoButton.classList.add("disabled");
                    }
                }
            });
        })
    };
}

class Bot {
    constructor(player, game) {
        this.Player = player;
        this.Game = game;
        this.deck = [];
        this.goodCards = 0;
        this.goodHand = false;
    }

    determineHand = () => {
        this.deck.forEach((card) => {
            if(this.Game.determineHierarchy(card) >= 8) 
                this.goodCards++; 
        });
        this.goodHand = (this.goodCards >= 2);
    }

    decideEnvido = (currentRound) => {
        let botScore = Game.bot.getEnvidoScore(); 

        if(botScore < 20) {
            alert("No quiero :(");
            this.Game.determineEnvidoWinner(2, "bot", true);
        } else if(botScore >= 20 && botScore <= 25) {
            alert("¡Quiero!");
            this.Game.determineEnvidoWinner(2, "", false);
        } else {
            let nextRound = "";
            switch(currentRound.toLowerCase()) {
                case "envido":
                    nextRound = "Real Envido";
                    break;
                case "real envido":
                    nextRound = "Falta Envido";
                    break;
                case "falta envido":
                    this.Game.determineEnvidoWinner(30 - this.Game.user.getScore(), "", false);
                    return;
            }

            alert(`¡¡¡${nextRound.toUpperCase()}!!!`);
            
            this.Game.showModal(
                nextRound, 
                `Bot te ha desafiado a un ${nextRound}, ¿Aceptas?`,
                "",
                true,
                true
            ); 
        } 
    }

    decideTruco = (currentRound) => {
        if(this.goodCards == 0) {
            alert("No quiero :(");
            // Fin de la ronda
            this.Game.determineTrucoWinner("bot", true);
            this.Game.startAnotherRound();
        } else if(botScore >= 20 && botScore <= 25) {
            alert("¡Quiero!");
            // Esperar a que se tiren todas las cartas y después determinar el ganador
            trucoPoints = 2;
        } else {
            let nextRound = "";
            switch(currentRound.toLowerCase()) {
                case "truco":
                    nextRound = "retruco";
                    break;
                case "retruco":
                    nextRound = "vale cuatro";
                    break;
                case "vale cuatro":
                    this.Game.determineTrucoWinner(30 - this.Game.user.getScore(), "", false);
                    return;
            }

            alert(`¡¡¡${nextRound.toUpperCase()}!!!`);
            
            this.Game.showModal(
                nextRound, 
                `Bot te ha desafiado a un ${nextRound}, ¿Aceptas?`,
                "",
                true,
                true
            ); 
        } 
    }

    askEnvido = () => {
        let pointsDifference = Math.abs(this.Game.bot.getScore() - this.Game.user.getScore());
        if(this.Game.bot.getEnvidoScore("bot") >= 20) {
            this.Game.showModal(
                "Envido", 
                `El bot te ha desafiado a un envido, ¿Aceptas?`,
                "", 
                false, 
                true,
            );
            return true;
        } else if(this.goodCards == 0 && pointsDifference < 5) {
            this.Game.showModal(
                "Real envido", 
                `El bot te ha desafiado a un Real envido, ¿Aceptas?`,
                "", 
                false, 
                true,
            );
            return true;
        } else if(this.goodCards == 0 && pointsDifference > 5) {
            this.Game.showModal(
                "Falta envido", 
                `El bot te ha desafiado a un Falta envido, ¿Aceptas?`,
                "", 
                false, 
                true,
            );
            return true;
        } else 
            return false;
    }

    askTruco = () => {
        if(this.goodHand) {
            this.Game.showModal(
                "Truco", 
                "El bot te ha desafiado a un truco, ¿Aceptas?",
                "", 
                false, 
                true,
            );
        } 
    }

    throwCard = () => {
        const cards = this.Game.bot.getDeck();
        cards.sort((a, b) => this.Game.determineHierarchy(b) - this.Game.determineHierarchy(a));

        let flag = false;
        cards.forEach((cardName, index) => {
            if(!flag) {
                const botDroppedCards = document.querySelector(".bot-dropped-cards");
                const cardCreator = new Card(cardName, "bot");
                const cardElement = cardCreator.createCard(false, "dropped-card");
                botDroppedCards.appendChild(cardElement);
                botDeck.firstElementChild.remove();
                cards.shift();
                this.Game.bot.droppedCards.push(cardName);
                flag = true;
            }
            return; 
        });
        nextTurn = "user";
    }
}

let Game = new Truco(new Player("user"), new Player("bot"));
let bot = new Bot(Game.bot, Game);
let trucoPoints = 1;
Game.startGame();

envidoButton.addEventListener("click", () => {
    if(!envidoButton.classList.contains("disabled")) {
        bot.decideEnvido("envido");
        envidoButton.classList.add("disabled");
    }
});

trucoButton.addEventListener("click", () => {
    bot.decideTruco();
});

replayButton.addEventListener("click", (event) => {
    event.preventDefault();
    Game.bot.updateScore(Game.bot.getScore() + trucoPoints);
    Game.startAnotherRound();
});
