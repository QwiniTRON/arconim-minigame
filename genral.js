"use strict"

const bite = document.querySelector("#bite");
const bal = document.querySelector("#bal");
const scoreBlock = document.querySelector("#score");
let difficult = 5;

if(location.search.search(/dif/gi)){
    let searchedDifficult = location.search.match(/dif=(\d)/i)
    difficult = searchedDifficult?.[1] || difficult;
}

// информация о мяче и его движениях
const ballInfo = {
    x: 400, 
    y: 300,
    r: 40,
    vector: {
        x: Math.random() > 0.5? 5 : -5,
        y: Math.random() > 0.5? 5 : -5 
    },
};
const biteInfo = {
    w: 20,
    y: 20,
    h: 200
};

class Game{
    constructor(difficult){
        this.difficult = difficult;
    }

    score = 0
    pressStatus = false

    platesPosition = {
        width: 20,
        height: 20
    }

    #showInfo = ()=>{
        let conteiner = document.querySelector("#conteiner");
        conteiner.insertAdjacentHTML("beforeend", "<div class=\"infoCard__block\"></div>");
        let blockInfo = `
            <div class="infoCard">
            <div class="infoCard__result">Ваш результат ${this.score}</div>
            <div class="infoCard__subtitle">Ещё раз?</div>
            <div class="infoCard__doRestart" onclick="location.reload()">играть снова!</div>
            </div>
        `;
        conteiner.insertAdjacentHTML("afterbegin", blockInfo);
    }

    #end = function(){
        document.removeEventListener("keydown", this.#handlePress);
        clearInterval(this.interval);
        this.#showInfo();
        clearInterval(this.degInterval);
    }

    #handleKeyUp = (e)=>{
        this.pressStatus = false;
    }

    #handlePress = (e)=>{
        let documentHeight = document.documentElement.clientHeight;
        clearTimeout(this.pushTimeout);

        if(e.code === "ArrowUp"){
            this.pressStatus = true

            biteInfo.y -= 10;
            if(biteInfo.y < 20){
                biteInfo.y = 20;
            }
            bite.style.top = biteInfo.y + "px";

            

            if(!e.repeat){
                let iterCount = 0;
                clearTimeout(this.pushTimeout);
                this.pushTimeout = setTimeout(function tim(){
                    biteInfo.y -= 10;
                    if(biteInfo.y < 20){
                        biteInfo.y = 20;
                    }
                    bite.style.top = biteInfo.y + "px";

                    iterCount++;
                    if(iterCount < 16 && this.pressStatus){
                        this.pushTimeout = setTimeout(tim.bind(this), 30);
                    }
                }.bind(this), 30);
            }
        }
        if(e.code === "ArrowDown"){
            this.pressStatus = true

            biteInfo.y += 10;
            if(biteInfo.y + biteInfo.h > documentHeight - 20){
                biteInfo.y = documentHeight - 20 - biteInfo.h;
            }
            bite.style.top = biteInfo.y + "px";

            if(!e.repeat){
                let iterCount = 0;
                clearTimeout(this.pushTimeout);

                this.pushTimeout = setTimeout(function tim(){

                    biteInfo.y += 10;
                    if(biteInfo.y + biteInfo.h > documentHeight - 20){
                        biteInfo.y = documentHeight - 20 - biteInfo.h;
                    }
                    bite.style.top = biteInfo.y + "px";

                    iterCount++;
                    if(iterCount < 16 && this.pressStatus){
                        this.pushTimeout = setTimeout(tim.bind(this), 30);
                    }
                }.bind(this), 30);
            }
        }
    }

    start(){
        document.addEventListener("keydown", this.#handlePress);
        document.addEventListener("keyup", this.#handleKeyUp);

        if(this.difficult > 2){
            this.degInterval = setInterval(()=>{
                if(Math.random() * Math.random() > 0.45){
    
                    let status = Math.random() > 0.5;
                    let deg = Math.round(Math.random() * 15);
                    let sign;
    
                    if(ballInfo.vector.y > 0){
                        if(status){
                            ballInfo.vector.y += deg;
                            sign = true;
                        }else{
                            ballInfo.vector.y -= deg;
                            sign = false;
                        }
                    }else{
                        if(status){
                            ballInfo.vector.y -= deg;
                            sign = false;
                        }else{
                            ballInfo.vector.y += deg;
                            sign = true;
                        }
                    }
                }
            }, 500);
        }

        this.interval = setInterval(()=>{
            this.#draw();
        }, 50);
    }

    #checkPosition = function(){
        let documentHeight = document.documentElement.clientHeight;
        let documentWidth = document.documentElement.clientWidth;

        // x
        if(ballInfo.x < 20){
            ballInfo.x = 20;
            ballInfo.vector.x = -ballInfo.vector.x;
            return;
        }

        // проверка соприкосновения с битой
        if( ballInfo.x + ballInfo.r * 2 > documentWidth - biteInfo.w - 20 && ballInfo.y + ballInfo.r <= (biteInfo.y + biteInfo.h) &&  ballInfo.y + ballInfo.r >= biteInfo.y ){
            this.score++;
            scoreBlock.textContent = this.score;

            if(ballInfo.vector.x > 0){
                ballInfo.vector.x++;
            }else{
                ballInfo.vector.x--;
            }

            if(ballInfo.vector.y > 0){
                ballInfo.vector.y++;
            }else{
                ballInfo.vector.y--;
            }

            ballInfo.x = documentWidth - 20 - 20 - ballInfo.r * 2 - 1;

            ballInfo.vector.x = -ballInfo.vector.x;
            return;
        }

        //условия поражения
        if(ballInfo.x + ballInfo.r * 2 > documentWidth - 20){
            ballInfo.x = documentWidth - 20 - ballInfo.r * 2;
            ballInfo.vector.x = -ballInfo.vector.x;

            this.#end();
            return;
        }

        // y
        if(ballInfo.y < 20){
            ballInfo.y = 20;
            ballInfo.vector.y = -ballInfo.vector.y;
            return;
        }
        if(ballInfo.y + ballInfo.r * 2> documentHeight - 20){
            ballInfo.y = documentHeight - 20 - ballInfo.r * 2;
            ballInfo.vector.y = -ballInfo.vector.y;
            return;
        }

    }

    #draw = function(){

        // move block
        ballInfo.x += ballInfo.vector.x;
        ballInfo.y += ballInfo.vector.y;

        this.#checkPosition();

        bal.style.top = ballInfo.y + 'px';
        bal.style.left = ballInfo.x + 'px';

    }
}

const game = new Game(difficult);

game.start();














