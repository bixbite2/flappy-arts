document.addEventListener('DOMContentLoaded', function() {
    let canvas, ctx, ALTURA, LARGURA, frames = 0,
        tubos = [];

    ALTURA = window.innerHeight;
    LARGURA = window.innerWidth;

    chao = {
        y: 550,
        altura: 50,
        // Parallax
        speed: 9,
        x1: 9,
        x2: -LARGURA,
        atualiza: function() {
            this.x1 -= this.speed;
            this.x2 -= this.speed;
            if (this.x1 <= -LARGURA) {
                this.x1 = LARGURA;
            }
            if (this.x2 <= -LARGURA) {
                this.x2 = LARGURA;
            }
        },
        desenha: function() {
            // Aqui desenha o chão
            if (bloco.estagio == 1) {
                this.img = document.getElementById('ground');
            }
            if (bloco.estagio == 2) {
                this.img = document.getElementById('ground1');
            }
            if (bloco.estagio == 3) {
                this.img = document.getElementById('ground2');
            }
            if (bloco.estagio == 4) {
                this.img = document.getElementById('ground3');
            }
            ctx.drawImage(this.img, this.x1, this.y, LARGURA + 1, this.altura);
            ctx.drawImage(this.img, this.x2, this.y, LARGURA + 1, this.altura);
        },
    }

    bloco = {
        pontuacao: 0,
        estagio: 1,
        altura: 38,
        largura: 49,
        y: 10,
        x: 50,
        gravidade: .5,
        velocidade: 0,
        forca: 7,
        morto: false,
        sound: new Audio("sound/sfx_wing.ogg"),
        pula: function() {
            if (this.y - this.altura > 0) {
                if (!bloco.morto) {
                    this.sound.currentTime = 0;
                    this.velocidade = -this.forca;
                    this.sound.play();
                }
            }
        },
        atualiza: function() {
            if (this.y + this.altura < 550) {
                this.velocidade += this.gravidade;
                this.y += this.velocidade;
            } else {
                this.velocidade = 0;
                this.y = 516;
                this.morto = true;
                // this.inerciaY = true;

                // alert('aqui é o chão');
            }
        },
        desenha: function() {
            // Aqui desenha o Pimbinha
            if (bloco.estagio == 1) {
                this.img = document.getElementById('flappy');
            }
            if (bloco.estagio == 2) {
                this.img = document.getElementById('flappy1');
            }
            if (bloco.estagio == 3) {
                this.img = document.getElementById('flappy2');
            }
            if (bloco.estagio == 4) {
                this.img = document.getElementById('flappy3');
            }
            ctx.drawImage(this.img, this.x, this.y, this.largura, this.altura);
        },
    }

    tubo = {
        // Caracteristicas gerais do tubo
        largura: 100,
        altura: ALTURA - 300,
        gap: 300,
        freq: 100,
        minheight: 50
    }

    background = {
        // Parallax
        speed: 4,
        x1: 4,
        x2: -LARGURA,
        atualiza: function() {
            this.x1 -= this.speed;
            this.x2 -= this.speed;
            if (this.x1 <= -LARGURA) {
                this.x1 = LARGURA;
            }
            if (this.x2 <= -LARGURA) {
                this.x2 = LARGURA;
            }
        },
        desenha: function() {
            // Aqui desenha o bg
            if (bloco.estagio == 1) {
                this.img = document.getElementById('bg');
            }
            if (bloco.estagio == 2) {
                this.img = document.getElementById('bg1');
            }
            if (bloco.estagio == 3) {
                this.img = document.getElementById('bg2');
            }
            if (bloco.estagio == 4) {
                this.img = document.getElementById('bg3');
            }
            ctx.drawImage(this.img, this.x1, 0, LARGURA, ALTURA);
            ctx.drawImage(this.img, this.x2, 0, LARGURA, ALTURA);
        },
    }

    function criatubo() {
        let novotubo = {
            passo: false,
            x: LARGURA,
            gapPos: Math.random() * (ALTURA - chao.altura - tubo.gap - tubo.minheight),
            speed: 9,
            permaGap: tubo.gap,
            atualiza: function() {
                this.x -= this.speed;
                if (bloco.x > this.x && !this.passo) {
                    bloco.pontuacao++;
                    this.passo = true;
                }
                if (bloco.x + bloco.largura > this.x && bloco.x < this.x + tubo.largura) {
                    if (!(bloco.y > this.gapPos && bloco.y + bloco.altura < this.gapPos + this.permaGap)) {
                        console.log("opa");
                        bloco.morto = true;
                    }
                }
            },

            desenha: function() {
                if (bloco.estagio == 1) {
                    this.topImg = document.getElementById('toptubo');
                    this.botImg = document.getElementById('bottubo');
                }
                if (bloco.estagio == 2) {
                    this.topImg = document.getElementById('toptubo1');
                    this.botImg = document.getElementById('bottubo1');
                }
                if (bloco.estagio == 3) {
                    this.topImg = document.getElementById('toptubo2');
                    this.botImg = document.getElementById('bottubo2');
                }
                if (bloco.estagio == 4) {
                    this.topImg = document.getElementById('toptubo3');
                    this.botImg = document.getElementById('bottubo3');
                }
                ctx.drawImage(this.topImg, this.x, -tubo.altura + this.gapPos, tubo.largura, tubo.altura);
                ctx.drawImage(this.botImg, this.x, this.gapPos + this.permaGap, tubo.largura, tubo.altura);
            }

        }

        tubos.push(novotubo);

    }

    function destroitubo() {

        tubos.splice(0, 1);

    }

    function main() {
        if (LARGURA >= 500) {
            LARGURA = 800;
            ALTURA = 600;
        }
        let canvas = document.createElement("canvas");
        canvas.width = LARGURA;
        canvas.height = ALTURA;
        canvas.style.border = "1px solid #000";

        ctx = canvas.getContext("2d");
        document.body.appendChild(canvas);
        document.addEventListener("mousedown", function clique(event) {
            event.preventDefault();
            bloco.pula();
        });

        roda();
    }

    function roda() {
        if (!bloco.morto) {
            atualiza()
            desenha();
        }

        window.requestAnimationFrame(roda);
    }

    marcador = bloco.pontuacao;

    function atualiza() {

        if (marcador == 0) {
            marcador = bloco.pontuacao;
        }

        if (bloco.pontuacao == marcador + 1) {
            bloco.estagio = 2;
            tubo.gap = 250;
        }
        if (bloco.pontuacao == marcador + 2) {
            bloco.estagio = 3;
            tubo.gap = 200;
        }
        if (bloco.pontuacao == marcador + 3) {
            bloco.estagio = 4;
            tubo.gap = 150;
        }
        if (bloco.pontuacao == marcador + 4) {
            bloco.estagio = 1;
            marcador = 0;
        }


        frames++;

        background.atualiza();

        chao.atualiza();

        if (frames >= tubo.freq) {
            criatubo();
            frames = 0;
            if (tubos.length > 1) {
                destroitubo();
            }
        }

        bloco.atualiza();
        for (let t of tubos) {
            t.atualiza();
        }
    }

    function desenha() {
        // let img = document.getElementById('bg');
        // ctx.drawImage(img, 0, 0, LARGURA, ALTURA);
        ctx.clearRect(0, 0, LARGURA, ALTURA);
        background.desenha();
        bloco.desenha();
        for (let t of tubos) {
            t.desenha();
        }
        chao.desenha();
        ctx.font = "50px Consolas";
        ctx.fillText(bloco.pontuacao, 400, 50);
    }

    // main inicia o game
    main();
});