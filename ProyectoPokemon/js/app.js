async function getpokemon() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon");
    const data = await response.json();
}
getpokemon();
//creo el grupo general
let grupoGeneral = document.querySelector('.groups');
let pokemonesid = [];
let pokemonespromesa = [];
let pokemonesjs = [];
let pokemonstats = [];
let conversor;
let button = document.getElementById('buton');
async function eleccion() {
    let num;

    for (let i = 0; i < 6; i++) {
        num = prompt("elija un numero de pokemon");
        pokemonesid.push(num);
    }

}
eleccion();
async function asignacion() {

    for (let i = 0; i < 6; i++) {
        pokemonespromesa[i] = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonesid[i]}`);
        conversor = await pokemonespromesa[i].json();
        pokemonesjs.push(conversor);
    }
    for (let i = 0; i < 6; i++) {
        const pokemonDiv = grupoGeneral.querySelector(`.pokemon${i}`);
        if (pokemonDiv) {
            pokemonDiv.textContent = pokemonesjs[i].name;
            const img = document.createElement('img');
            img.src = pokemonesjs[i].sprites.front_default;
            img.alt = pokemonesjs[i].name;
            pokemonDiv.appendChild(img);
            let ataquepokemon = document.createElement('li');
            let defensapokemon = document.createElement('li');
            let vidapokemon = document.createElement('li');
            let ataque;
            let defensa;
            let vida;
            pokemonesjs[i].stats.forEach(i => {
                if (i.stat.name === 'hp') {
                    vidapokemon.textContent = (`Vida : ` + i.base_stat)
                    vidapokemon.className = 'vida'
                    pokemonDiv.appendChild(vidapokemon);
                    vida = i.base_stat;

                }
                if (i.stat.name === 'attack') {
                    ataquepokemon.textContent = (`Daño : ` + i.base_stat);
                    ataquepokemon.className = 'ataque'
                    pokemonDiv.appendChild(ataquepokemon);
                    ataque = i.base_stat;
                }
                if (i.stat.name === 'defense') {
                    defensapokemon.textContent = ('Defensa : ' + i.base_stat);
                    defensapokemon.className = 'defensa'
                    pokemonDiv.appendChild(defensapokemon);
                    defensa = i.base_stat;
                }

            });
            pokemonstats.push({
                id: pokemonesjs[i].id,
                hp: vida,
                atq: ataque,
                def: defensa
            });
        }
    }

}
//funcion para hacer las cosas con tiempo
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let contador1 = 0;
let contador2 = 0;
button.addEventListener("click", async function batalla() {

    for (let l = 0; l < 4; l++) {
        if (contador1 >= 2) {
            console.log('El equipo 1 gano la batalla');
            break;
        }
        if (contador2 >= 2) {
            console.log('El equipo 2 gano la batalla');
            break;
        }
        console.log(`comienza batalla entre ${pokemonesjs[l].name} y ${pokemonesjs[l + 3].name}`);
        await delay(3000);
        for (let i = 0; pokemonstats[l].hp > 0 && pokemonstats[l + 3].hp > 0; i++) {
            //ataca equipo 1
            console.log(`Atacara ${pokemonesjs[l].name}`);
            await delay(2000);
            if (pokemonstats[l].atq >= pokemonstats[l + 3].def) {
                console.log(`El ataque de ${pokemonesjs[l].name} sobrepaso las defensas de ${pokemonesjs[l + 3].name}`);
                let ataqueefectivo = pokemonstats[l].atq - pokemonstats[l + 3].def;
                let bajoDeDefensa = pokemonstats[l + 3].def - pokemonstats[l].atq;
                if (bajoDeDefensa <= 0) {
                    bajoDeDefensa = 0;
                }
                pokemonstats[l + 3].def = bajoDeDefensa;
                await delay(2000);
                pokemonstats[l + 3].hp = pokemonstats[l + 3].hp - ataqueefectivo;
                await delay(2000);
                console.log(`Se redujo la armadura de  ${pokemonesjs[l + 3].name} a ${pokemonstats[l + 3].def}`)
                console.log(`La vida de ${pokemonesjs[l + 3].name} se redujo a ` + pokemonstats[l + 3].hp);
                await delay(2000);
                //comprobacion de victoria grupo 1
                if (pokemonstats[l + 3].hp <= 0) {
                    console.log(`El Ganador de la Batalla fue ${pokemonesjs[l].name}`);
                    pokemonDiv = grupoGeneral.querySelector(`.pokemon${l + 3}`);
                    if (pokemonDiv) {
                        pokemonDiv.classList.add('derrotado');
                    }
                    await delay(4000);
                    contador1++;
                    console.log(`El Equipo 1 tiene ${contador1} batallas ganadas`)
                    await delay(1000);
                    break;
                }
                pokemonDiv = grupoGeneral.querySelector(`.pokemon${l + 3}`);
                if (pokemonDiv) {
                    pokemonDiv.querySelector(`.vida`).textContent = `Vida: ${pokemonstats[l + 3].hp}`;
                    if (pokemonstats[l + 3].hp < 0) {
                        pokemonDiv.querySelector(`.vida`).textContent = `Vida: 0 `;
                    }
                    pokemonDiv.querySelector(`.defensa`).textContent = `Defensa: ${pokemonstats[l + 3].def}`;
                    if (pokemonstats[l + 3].def < 0) {
                        pokemonDiv.querySelector(`.defensa`).textContent = `Defensa: 0`;
                        await delay(2000);
                    }
                }
                await delay(2000);
            }
            //ataca equipo 1
            if (pokemonstats[l].atq < pokemonstats[l + 3].def) {
                console.log(`El ataque de ${pokemonesjs[l].name} no sobrepaso las defensas de ${pokemonesjs[l + 3].name}`);
                bajoDeDefensa = pokemonstats[l + 3].def - pokemonstats[l].atq;
                await delay(2000);
                pokemonstats[l + 3].def = bajoDeDefensa;
                console.log(`La vida de ${pokemonesjs[l + 3].name} no sufrio daños pero su defensa se redujo a ` + pokemonstats[l + 3].def);
                await delay(2000);
                pokemonDiv = grupoGeneral.querySelector(`.pokemon${l + 3}`);
                if (pokemonDiv) {
                    pokemonDiv.querySelector(`.defensa`).textContent = `Defensa: ${pokemonstats[l + 3].def}`;
                    if (pokemonstats[l + 3].def < 0) {
                        pokemonDiv.querySelector(`.defensa`).textContent = `Defensa: 0`;
                        await delay(2000);
                    }
                    pokemonDiv.querySelector(`.defensa`).textContent = `Defensa: ${pokemonstats[l + 3].def}`;
                    if (pokemonstats[l + 3].def < 0) {
                        pokemonDiv.querySelector(`.defensa`).textContent = `Defensa: 0`;
                        await delay(2000);
                    }
                }
            }
            //comprobacion de victoria grupo 1
            if (pokemonstats[l + 3].hp <= 0) {
                console.log(`El Ganador de la Batalla fue ${pokemonesjs[l].name}`);
                pokemonDiv = grupoGeneral.querySelector(`.pokemon${l + 3}`);
                if (pokemonDiv) {
                    pokemonDiv.classList.add('derrotado');
                }
                await delay(4000);
                contador1++;
                console.log(`El Equipo 1 tiene ${contador1} batallas ganadas`)
                await delay(1000);
                break;
            }
            await delay(2000);
            console.log(`Atacara ${pokemonesjs[l + 3].name}`);
            //ataca equipo 2
            if (pokemonstats[l + 3].atq > pokemonstats[l].def) {
                console.log(`El ataque de ${pokemonesjs[l + 3].name} sobrepaso las defensas de ${pokemonesjs[l].name}`);
                ataqueefectivo = pokemonstats[l + 3].atq - pokemonstats[l].def;
                pokemonstats[l].hp = pokemonstats[l].hp - ataqueefectivo;
                bajoDeDefensa = pokemonstats[l].def - pokemonstats[l + 3].atq;
                if (bajoDeDefensa <= 0) {
                    bajoDeDefensa = 0;
                }
                await delay(2000);
                console.log(`Se redujo la armadura de  ${pokemonesjs[l + 3]} a ${pokemonstats[l + 3].def}`)
                await delay(2000);
                console.log(`La vida de ${pokemonesjs[l].name} se redujo a ` + pokemonstats[l].hp);
                await delay(2000);
                pokemonDiv = grupoGeneral.querySelector(`.pokemon${l}`);
                if (pokemonDiv) {
                    pokemonDiv.querySelector(`.vida`).textContent = `Vida: ${pokemonstats[l].hp}`;
                    if (pokemonstats[l].hp < 0) {
                        pokemonDiv.querySelector(`.vida`).textContent = `Vida: 0 `;
                        await delay(2000);
                    }
                    pokemonDiv.querySelector(`.defensa`).textContent = `Defensa: ${pokemonstats[l].def}`;
                    if (pokemonstats[l].def < 0) {
                        pokemonDiv.querySelector(`.defensa`).textContent = `Defensa: 0`;
                        await delay(2000);
                    }

                }
                //comprobacion de victoria grupo 2
                if (pokemonstats[l].hp <= 0) {
                    console.log(`El Ganador de la Batalla fue ${pokemonesjs[l + 3].name}`)
                    pokemonDiv = grupoGeneral.querySelector(`.pokemon${l}`);
                    if (pokemonDiv) {
                        pokemonDiv.classList.add('derrotado');
                    }
                    await delay(4000);
                    contador2++;
                    console.log(`El Equipo 2 tiene ${contador2} batallas ganadas`)
                    await delay(1000);
                    break;
                }

            }
            //ataca equipo 2
            if (pokemonstats[l + 3].atq <= pokemonstats[l].def) {
                console.log(`El ataque de ${pokemonesjs[l].name} no sobrepaso las defensas de ${pokemonesjs[l + 3].name}`);
                bajoDeDefensa = pokemonstats[l].def - pokemonstats[l + 3].atq;
                pokemonstats[l + 3].def = bajoDeDefensa;
                console.log(`La vida de ${pokemonesjs[l].name} no sufrio daño pero su defensa se redujo a ` + pokemonstats[l + 3].def);
                await delay(2000);
                pokemonDiv = grupoGeneral.querySelector(`.pokemon${l}`);
                if (pokemonDiv) {
                    pokemonDiv.querySelector(`.defensa`).textContent = `Defensa: ${pokemonstats[l].def}`;
                    if (pokemonstats[l].def < 0) {
                        pokemonDiv.querySelector(`.defensa`).textContent = `Defensa: 0`;
                        await delay(2000);
                    }
                }
            }
            //comprobacion de victoria grupo 2
            if (pokemonstats[l].hp <= 0) {
                console.log(`El Ganador de la Batalla fue ${pokemonesjs[l + 3].name}`)
                pokemonDiv = grupoGeneral.querySelector(`.pokemon${l}`);
                if (pokemonDiv) {
                    pokemonDiv.classList.add('derrotado');
                }
                await delay(4000);
                contador2++;
                console.log(`El Equipo 2 tiene ${contador2} batallas ganadas`)
                await delay(1000);
                break;
            }
            //comprobacion de victoria grupo 1
            if (pokemonstats[l + 3].hp <= 0) {
                console.log(`El Ganador de la Batalla fue ${pokemonesjs[l].name}`);
                pokemonDiv = grupoGeneral.querySelector(`.pokemon${l + 3}`);
                if (pokemonDiv) {
                    pokemonDiv.classList.add('derrotado');
                }
                await delay(4000);
                contador1++;
                console.log(`El Equipo 1 tiene ${contador1} batallas ganadas`)
                await delay(1000);
                break;
            }
            if (contador1 >= 2) {
                console.log('El equipo 1 gano la batalla');
                break;
            }
            if (contador2 >= 2) {
                console.log('El equipo 2 gano la batalla');
                break;
            }
        }
    }



})

asignacion();