// CONFIGURATION DU JEU
const MOTS = [
            'JAVASCRIPT', 'PYTHON', 'ORDINATEUR', 'PROGRAMMATION', 'DEVELOPPEUR', 'INTERNET', 'ALGORITHME', 'LOGICIEL', 'CLAVIER', 'SOURIS', 'ECRAN', 'RESEAU', 'SERVEUR', 'DONNEES', 'FICHIER', 'APPLICATION', 'FONCTION', 'VARIABLE', 'BOUCLE', 'CONDITION'
        ];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const MAX_ERREURS = 6;

// VARIABLES DU JEU
    let motSecret = '';
    let lettresTrouvees = new Set();
    let erreurs = 0;
    let finJeu = false;
    let gagne = false;

// ÉLÉMENTS DOM - RÉCUPÉRATION DES ÉLÉMENTS HTML
const compteur = document.getElementById('compteur');
const motContainer = document.getElementById('mot-container');
const clavier = document.getElementById('clavier');
const inputMot = document.getElementById('input-mot');
const btnProposer = document.getElementById('btn-proposer');
const propositionZone = document.getElementById('proposition-zone');
const msgVictoire = document.getElementById('msg-victoire');
const msgDefaite = document.getElementById('msg-defaite');
const motVictoire = document.getElementById('mot-victoire');
const motDefaite = document.getElementById('mot-defaite');
const btnNouveau = document.getElementById('btn-nouveau');


//ÉLÉMENTS DU PENDU
const tete = document.getElementById('tete');
const corps = document.getElementById('corps');
const brasGauche = document.getElementById('bras-gauche');
const brasDroit = document.getElementById('bras-droit');
const jambeGauche = document.getElementById('jambe-gauche');
const jambeDroite = document.getElementById('jambe-droite');

// DÉMARRER NOUVELLE PARTIE
function nouvellePartie() {
        motSecret = MOTS[Math.floor(Math.random() *     MOTS.length)];
        lettresTrouvees = new Set();
        erreurs = 0;
        finJeu = false;
        gagne = false;

        compteur.textContent = '0';
        inputMot.value = '';
        msgVictoire.classList.remove('show');
        msgDefaite.classList.remove('show');
        propositionZone.style.display = 'block';

        cacherCorps();
        afficherMot();
        creerClavier();
        }

// CACHER TOUTES LES PARTIES DU CORPS
function cacherCorps() {
        tete.classList.remove('visible');
        corps.classList.remove('visible');
        brasGauche.classList.remove('visible');
        brasDroit.classList.remove('visible');
        jambeGauche.classList.remove('visible');
        jambeDroite.classList.remove('visible');
        }

// AFFICHER LES PARTIES DU CORPS
function afficherCorps() {
        if (erreurs >= 1) tete.classList.add('visible');
        if (erreurs >= 2) corps.classList.add('visible');
        if (erreurs >= 3) brasGauche.classList.add('visible');
        if (erreurs >= 4) brasDroit.classList.add('visible');
        if (erreurs >= 5) jambeGauche.classList.add('visible');
        if (erreurs >= 6) jambeDroite.classList.add('visible');
        }

// AFFICHER LE MOT
function afficherMot() {
        motContainer.innerHTML = '';
        for (let lettre of motSecret) {
            const div = document.createElement('div');
            div.className = 'lettre-case';
            if (lettresTrouvees.has(lettre)) {
                div.textContent = lettre;
            }
            motContainer.appendChild(div);
        }
}

// CRÉER LE CLAVIER
function creerClavier() {
        clavier.innerHTML = '';
        ALPHABET.forEach(lettre => {
            const btn = document.createElement('button');
            btn.textContent = lettre;
            btn.className = 'lettre-btn';

            if (lettresTrouvees.has(lettre)) {
                btn.className += motSecret.includes(lettre) ? ' correct' : ' incorrect';
            } else if (finJeu) {
                btn.className += ' disabled';
            } else {
                btn.className += ' dispo';
                btn.onclick = () => choisirLettre(lettre);
            }

            clavier.appendChild(btn);
        });
}

// CHOISIR UNE LETTRE
function choisirLettre(lettre) {
    if (finJeu || lettresTrouvees.has(lettre)) return;

    lettresTrouvees.add(lettre);

    if (!motSecret.includes(lettre)) {
        erreurs++;
        compteur.textContent = erreurs;
        afficherCorps();

        if (erreurs >= MAX_ERREURS) {
            perdre();
        }
    } else {
        if (verifierVictoire()) {
            gagner();
        }
    }

    afficherMot();
    creerClavier();
}

// VÉRIFIER VICTOIRE
function verifierVictoire() {
    for (let lettre of motSecret) {
        if (!lettresTrouvees.has(lettre)) return false;
    }
    return true;
}

// PROPOSER UN MOT
function proposerMot() {
    if (finJeu) return;

    const proposition = inputMot.value.toUpperCase().trim();
    if (!proposition) return;

    if (proposition === motSecret) {
        for (let lettre of motSecret) {
            lettresTrouvees.add(lettre);
        }
        gagner();
    } else {
        erreurs++;
        compteur.textContent = erreurs;
        afficherCorps();

        if (erreurs >= MAX_ERREURS) {
            perdre();
        }
    }

    inputMot.value = '';
    afficherMot();
    creerClavier();
}

// GAGNER
function gagner() {
    gagne = true;
    finJeu = true;
    motVictoire.textContent = motSecret;
    msgVictoire.classList.add('show');
    propositionZone.style.display = 'none';
    creerClavier();
}

// PERDRE
function perdre() {
    finJeu = true;
    motDefaite.textContent = motSecret;
    msgDefaite.classList.add('show');
    propositionZone.style.display = 'none';
    creerClavier();
}

// ÉVÉNEMENTS
btnProposer.addEventListener('click', proposerMot);
inputMot.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') proposerMot();
});
btnNouveau.addEventListener('click', nouvellePartie);

// DÉMARRER UNE NOUVELLE PARTIE 
nouvellePartie();