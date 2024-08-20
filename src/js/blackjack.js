const   dealerDeck  = document.querySelector(".dealer-deck");
const    userDeck   = document.querySelector(".user-deck");
const   hitButton   = document.querySelector(".hit");
const  standButton  = document.querySelector(".stand");
const dealerCounter = document.querySelector(".dealer-counter");
const  userCounter  = document.querySelector(".user-counter");
const  startButton  = document.querySelector(".start-button");
const      line     = document.querySelector(".line");
const  gameSection  = document.querySelector(".game-section-container");
const   gameIntro   = document.querySelector(".game-intro");
const gameIntroContainer = document.querySelector(".game-intro-container");
const inactiveGameSection = document.querySelector(".inactive-game");

startButton.addEventListener("click", () => {
    gameIntroContainer.style.display = "none";
    gameIntro.style.display   = "none";
    gameSection.style.display = "block";
    line.style.display = "block";
});

const randomNumber = (max, min) => {
    return Math.floor(Math.random() * (max - min) + min);
}

class Card {
    constructor(card = null, player = "user") {
        this.card = card;
        this.player = player;
    }
    
    getCardName() {
        return this.card;
    }

    addCard = (cardElement) => {
        (
            this.player === "dealer" ?  
            dealerDeck.appendChild(cardElement) :
            userDeck.appendChild(cardElement)
        );
    }

    static shuffle = () => {
        const suits = ["Club", "Diamond", "Spade", "Heart"];
        const cards = ["Jack", "Queen", "King", "Ace"];
        
        for(let num = 2; num <= 10; num++) 
            cards.unshift(num.toString());
    
        let suit = suits[randomNumber(0, 3)];
        let cardNumber = cards[randomNumber(0, 12)];

        return `${cardNumber}-${suit}`;
    }

    createCard = () => {
        const cardName = this.card || Card.shuffle();
        const [name, suit] = cardName.split('-');
        this.card = cardName;

        let cardElement = document.createElement("IMG"); 
        cardElement.src = `../../src/assets/englishDeck/${this.card}.png`;
        cardElement.className = "card";
        cardElement.alt = `Carta ${name} ${suit} de baraja inglesa`;
        cardElement.title = `${name} ${suit}`;

        if(cardName === "BACK")
            cardElement.classList.add("turnedOver");

        this.addCard(cardElement);
    }
}

class Player {
    constructor(player, moneyAmount) {
        this.player = player;
        this.moneyAmount = moneyAmount;
        this.score = 0;
        this.deck = [];
    }

    getDeck  = () => this.deck;

    getScore = () => this.score;

    updateScore = () => {
        let lastCard = this.deck[this.deck.length - 1];
        switch(lastCard) {
            case "Jack":
                this.score += 10;
                break;
            case "Queen":
                this.score += 10;
                break;
            case "King":
                this.score += 10;
                break;
            case "Ace":
                (
                    this.score + 11 > 21 ?
                    this.score++ :
                    this.score += 11
                );
                break;
            case "BACK":
                this.score += 0;
                break;
            default:
                this.score += parseInt(lastCard);
                break;
        }

        if(this.player == "user")
            userCounter.textContent = this.score;
        else 
            dealerCounter.textContent = this.score;
    }

    addCard = (card, player) => {
        const currentCard = new Card(card, player);
        currentCard.createCard();
        this.deck.push(currentCard.getCardName().split("-")[0]);
        this.updateScore();
    }
}

class BlackJack {
    constructor(user, dealer) {
        this.user   = user;
        this.dealer = dealer;
        this.winner = null;
        this.loser  = null;
        this.gameEnded = false;
    }

    getWinner = () => this.winner;
    
    clearDeck = () => {
        const deck = document.querySelectorAll(".card");

        for(let card of deck) 
            card.remove();
    }

    startGame = () => {
        dealer.addCard(null, dealer.player);
        dealer.addCard("BACK", dealer.player);
        
        user.addCard(null, user.player);
        user.addCard(null, user.player);

        if(user.getScore() == 21) {
            alert("BlackJack!!");
            alert("Gano el user");
        } else if(dealer.getScore() == 21) {
            alert("BlackJack!!");
            alert("Gano el dealer");
        }
    }

    endGame = (winner) => {
        this.gameEnded = true;
        this.winner = winner;
        this.loser  = (winner == "user" ? "dealer" : "user");
        alert(`Gana el ${this.winner}`);
        
        let playAgain = confirm("¿Quieres volver a jugar?");
        if(playAgain) {
            this.clearDeck();
            startGame();
        }
    }

    determineWinner = () => {
        if(user.getScore() > dealer.getScore() || dealer.getScore() > 21) {
            if(dealer.getScore() > 21) { 
                alert("El dealer se paso de 21");
            }
            this.endGame("user");
        } else if(dealer.getScore() > user.getScore() || user.getScore() > 21) {
            if(user.getScore() > 21) {
                alert("Te pasaste de 21");
            }
            this.endGame("dealer");
        } else alert("Empate");
    }

    hit = () => {
        if(user.getScore() < 21) 
            user.addCard(null, user.player);
        
        if(user.getScore() > 21) {
            alert("Perdiste");
            this.gameEnded = true;
        }
    }

    stand = () => {
        const lastDealerCard = document.querySelector(".turnedOver");
        if(lastDealerCard) lastDealerCard.remove();

        const dealNextCard = () => {
            if (this.dealer.getScore() < 17) {
                this.dealer.addCard(null, this.dealer.player);
                setTimeout(dealNextCard, 300);
            } else this.determineWinner();
        };

        dealNextCard();
    }
}

let dealer = new Object;
let  user  = new Object;
let  game  = new Object;

const startGame = () => {
    dealer = new Player("dealer");
    user = new Player("user");

    game = new BlackJack(user, dealer);
    game.startGame();
}

startGame();

hitButton.addEventListener("click", () => {
    if(!game.gameEnded) 
        game.hit();
    else 
        alert("Juego terminado");
});

standButton.addEventListener("click", () => {
    if(!game.gameEnded)
        game.stand();
    else 
        alert("Juego terminado");
});

