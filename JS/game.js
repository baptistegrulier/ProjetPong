const canvas=document.querySelector("canvas"), // initialisation canvas
ctx=canvas.getContext("2d");                   //           //
let vx=1, vy=1, compt=0, PtJ1=0, PtJ2=0; // initialisation des variables

const pad1 = { //initialisation des classes de pad (pos & taille)
    x: 2, 
    h: canvas.height * 0.16,
    w: 3, 
    y: (canvas.height / 2) - ((canvas.height * 0.16) / 2)
}

const pad2 = { //initialisation des classes de pad (pos & taille)
    x: canvas.width - 3,
    h: canvas.height * 0.16,
    w: 3, 
    y: (canvas.height / 2) - ((canvas.height * 0.16) / 2)
}

const ball = { //initialisation de la classe ball (pos & taille)
   x: (canvas.width / 2)+1.5,
   y: (canvas.height / 2),
   rayon: 3
}

function limites(){ //limites les déplacements pour ne pas sortir du stade
    if(valueS) { // si pression sur la touche S (bool)
        if(pad1.y>(canvas.height-(canvas.height * 0.16))-6){  // pos y du pad > la hauteur totale du stade - la hauteur de la ligne verticale
        }
        else{
            pad1.y += 3; //modification de la position du pad -> deplacement
        }
    }
    if(valueZ) { //                //
        if(pad1.y<=3){ 
        }
        else{
            pad1.y -= 3;
        }
    }
    if((ball.y-canvas.height*0.08)>pad2.y) { // pos ball - la moitié du pad > pos pad (permet de centrer le pad quand il suit la balle)
        if(pad2.y>(canvas.height-(canvas.height * 0.16))-3){  // limites du stade
        }
        else{
            pad2.y += 1;  // fais descendre le pad car ball en doussous du pad
        }
    }
    if((ball.y-ball.rayon)<pad2.y+(canvas.height*0.08)){ //     balle au dessus du pad ...
        if(pad2.y<=2){  // limites du stade
        }
        else{
            pad2.y -= 1;
        }
    }
}

function dessinerPad(x,y,w,h){ // affichage des pads dans le canvas
    ctx.beginPath(); // vide la liste des chemins pour en creer un nouveau
    ctx.fillStyle="blue"; // couleur de remplissage du rectangle
    ctx.fillRect(x,y,w,h); // dessine le rectangle à la position x,y de largeur de w et de hauteur h
}

function dessineBall(x,y,rayon){ // affichage la balle dans le canvas
   ctx.beginPath(); 
   ctx.fillStyle="red";
   ctx.arc(x,y,rayon,0, 2*Math.PI); // dessine la balle
   ctx.fill(); // rempli la balle
}

function afficheScore1(PtJ1){ // affiche le score du joueur 1 (vous)
    var pt1 = PtJ1; // init var = score j1 
    pt1.toString(); // passage de int à str
    ctx.beginPath(); 
    ctx.fillStyle="white"; // couleur de remplissage du score
    ctx.font = "10px sans-serif"; // police
    ctx.fillText(pt1,(canvas.width*0.45),(canvas.height*0.08)); // dessine le score du j1 aux positions x,y
}

function afficheScore2(PtJ2){ // affiche le score du joeur 2 (bot)
    var pt2 = PtJ2; // init var = score j2
    pt2.toString();
    ctx.beginPath();
    ctx.fillStyle="white";
    ctx.font = "10px sans-serif";
    ctx.fillText(pt2,(canvas.width*0.545),(canvas.height*0.08)); // dessine le score du j2 aux positions x,y
}

function afficheStart(){ // affiche la page d'acceuil
    ctx.beginPath();
    ctx.fillStyle="blue";
    ctx.font = "20px sans-serif";
    ctx.fillText("Press 'p' to play",(canvas.width*0.27),(canvas.height/2),200);
}

function fin(){ // affiche la page de fin
    ctx.beginPath();
    ctx.font = "20px sans-serif";
    if(PtJ1>PtJ2){
        ctx.fillStyle="red";
        ctx.fillText("You won !",(canvas.width*0.38),(canvas.height/2),200);
        ctx.fillStyle="blue";
        ctx.fillText("Press 'r' to restart",(canvas.width*0.25),(canvas.height*0.85),200);
    }
    else{
        ctx.fillStyle="red";
        ctx.fillText("You lost",(canvas.width*0.38),(canvas.height/2),200);
        ctx.fillStyle="blue";
        ctx.fillText("Press 'r' to restart",(canvas.width*0.25),(canvas.height*0.85),200);
    }
}

function moveBall(){ // deplacement la balle
   ball.x += vx; // ajoute la vitesse de la balle (qui augmente au cours du jeu) 
   ball.y += vy; // à la pos de la balle en x et y pour faire un déplacement
}

function rebondBall(){ // multiplie par l'inverse la vitesse de la balle pour changer la direction
   if(ball.y>(canvas.height-ball.rayon)-2){ // quand lim du stade
       vy *= -1;
   }
   if(ball.y<=ball.rayon+1){ // stade
       vy *= -1;
   }
   if(ball.y>pad2.y && ball.y<(pad2.y+(canvas.height*0.16)) && (ball.x+ball.rayon) > pad2.x){ // pad
       vx *= -1;
       compt += 1; // nombre d'echange entre les deux joueurs (pour l'acceleration)
   }
   if(ball.y>pad1.y && ball.y<(pad1.y+(canvas.height*0.16)) && (ball.x-ball.rayon) < (pad1.x+pad1.w)){
       vx *= -1;
       compt += 1;
   }
}

function accel(){ // acceleration de la balle
    if(compt==4 && vx<4){ // tout les quatres échanges -> accel si la vitesse n'est pas a sa limite (sinon injouable)
        vx+=0.5; // ajout de 0.5 a la vitesse de la balle
        if(vy<4 && vx > 0){ // ajour seulement quand vitesse positive (sinon neg + 0.5 = ralentissement)
            vy+=0.5;
        }
        compt=0; // remise à 0 du compteur 
    }
}

function restart(){ // remise à 0 de toutes les positions 
    ball.x=(canvas.width / 2)+1.5;
    ball.y=(canvas.height / 2);
    pad1.x=2;
    pad1.y=(canvas.height / 2) - ((canvas.height * 0.16) / 2);
    pad2.x=canvas.width - 3;
    pad2.y=(canvas.height / 2) - ((canvas.height * 0.16) / 2);
    vx=1;
    vy=1;
    compt=0;
}

function comptPoints(){ // gestion score et remise en jeu
    if(ball.x>canvas.width+10){// quand le joueur rate la balle (dépasse le terrain) 
        PtJ1 += 1; // ajout de 1 au score du joueur 
        restart(); // remise a zero des coord pour reprendre le jeu
    }
    if(ball.x<-10){
        PtJ2 += 1;
        restart();
    }
}

let valueS = false, valueZ = false, Vstart = false; // init var bool
document.addEventListener("keydown", e => { // recupere la touche pressée
    console.log(e); // affiche l'évenement dans la console (debug)
    if(e.key=='s') { // verif des touches
        valueS=true;
    }
    if(e.key=='z') {
        valueZ=true; // bool de pression de la touche, utilisé dans la fonction de mouv des pads
    }
    if(e.key=='p') {
        Vstart=true; // cond de départ pour lancer le jeu
    }
    if(e.key=='t') { // test (départ vitesse plus élevée et score à 6)
        Vstart=true;
        vx+=0.2;
        vy+=0.2;
        PtJ1+=6;
        PtJ2+=6;
    }
    if(e.key=='r') { // restart (remise à 0 de tout les éléments du jeu)
        Vstart=false; 
        PtJ1=0;
        PtJ2=0;
        restart();
    }
});

document.addEventListener("keyup", e => { //recupere les touches non préssées
    if(e.key=='s') {
        valueS=false;
    }
    if(e.key=='z') {
        valueZ=false;
    }
});

function gameLoop(){ // fonction du jeu
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas (efface tout les dessins)
    requestAnimationFrame(gameLoop); // repetitions controlée pour éviter un decalage entre l'appel et l'affichage (60 fps)

    if(Vstart){ // cond jeu true -> jeu
        if(PtJ1>6 || PtJ2>6){ // si scores > à 6, arret du jeu et affichage de la page de fin
            fin(); 
        }
        else{ // si scores < 7, appel des fonctions qui font le jeu
            ////////////////////////////////////////
            dessineBall(ball.x,ball.y,ball.rayon);
            moveBall(1,1);
            rebondBall();
        
            dessinerPad(pad1.x,pad1.y,pad1.w,pad1.h);
            dessinerPad(pad2.x,pad2.y,pad2.w,pad2.h);
            afficheScore1(PtJ1);
            afficheScore2(PtJ2);
        
            limites();
        
            accel();
        
            comptPoints();
            ////////////////////////////////////////
        }
    }
    else{ // cond jeu false -> affiche la page d'acceuil
        afficheStart();
    }
}

gameLoop(); // appel de la fonction de jeu