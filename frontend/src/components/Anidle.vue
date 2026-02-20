<template>
<div class="anidle">
    <div class="game_title">
        <h1>Classic</h1>
        <button class="info"><Info/></button>
    </div>

    <div class="guess">

        <div class="shadow_input"></div>
        <form action="" @submit.prevent="guessAnime">
            <input
                type="text"
                class="input_search"
                placeholder="Enter your guess"
                v-model="guess"
            />
            <button type="submit" class="submit_guess" @click="submit"><SendHorizontal/></button>
        </form>

    </div>

    <button @click="resetGuess">Reset</button>

    <div>
        <!-- réponse du search -->
    </div>

    <section class="previous_guesses">
        <table>
            <thead>
                <tr>
                    <th>Anime</th>
                    <th>Year</th>
                    <th>Source</th>
                    <th>Studio</th>
                    <th>Genres</th>
                    <th>Tags</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="anime in allGuess" :key="anime">
                    <td>
                        <div class="anime_img_title">
                            <img :src="`${anime[2]}`" alt="cover">
                            <div class="overlay">
                                <h3 class="anime_title">{{ anime[1] }}</h3>
                            </div>
                        </div>

                    </td>
                    <td :class="{good_answer: anime[3] == answer.year,bad_answer: anime[3] != answer.year}">
                        <div class="year">
                            <h3>{{ anime[3] }}</h3>
                            <ArrowBigDown class="arrow" v-if="anime[3] > answer.year" />
                            <ArrowBigUp class="arrow" v-else-if="anime[3] < answer.year" />
                        </div>
                    </td>
                    <td :class="{good_answer: anime[4] == answer.source,bad_answer: anime[4] != answer.source}"> {{ anime[4] }}</td>
                    <td :class="{good_answer: anime[5] == answer.studio,bad_answer: anime[5] != answer.studio}"> {{ anime[5] }}</td>
                    <td>
                        <ul>
                            <li v-for="genre in anime[6]" :key="genre">
                                <h3 :class="{good_answer: answer.genres?.includes(genre),bad_answer: !answer.genres?.includes(genre)}">{{genre}}</h3>
                            </li>
                        </ul>
                    </td>
                    <td>
                        <ul>
                            <li v-for="index in 4" :key="index">
                                <h3 
                                :class="{good_answer: answer.tags?.slice(0,4).includes(anime[7][index-1]),
                                        bad_answer: !answer.tags?.includes(anime[7][index-1]),
                                        almost_answer: answer.tags?.includes(anime[7][index-1],4)}">
                                    {{ anime[7][index-1] }}
                                </h3>
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>

</div>



</template>

<script setup>
import { Info, SendHorizontal, ArrowBigDown, ArrowBigUp } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { getAllGuesses } from '../composable/AnidleGuesses.js';

// array contenant les guess de l'utilisateur dans une variable de session
const allGuessArray = getAllGuesses();
const allGuess = allGuessArray.array;

// URLS de l'API du serveur
const DAILYANIME_API_URL = 'http://localhost:3000/api/daily'
const ALLANIME_API_URL = 'http://localhost:3000/api/anime';

// input de l'utilisateur
const guess = ref();
// réponse du jour
const answer = ref([]);
// tous les animes de la database
const animes = ref([]);

const error = ref(null);
const message = ref('');

// récupere l'anime du jour
async function fetchDailyAnime() {
  error.value = null;
  try {
    const response = await fetch(DAILYANIME_API_URL);
    if (!response.ok) throw new Error('Erreur réseau');
    answer.value = await response.json();
  } catch (err) {
    error.value = 'Impossible de charger le daily anime: ' + err.message;
    console.error(err);
  }
}

// récupere tous les animes de la databse
async function fetchAllAnimes() {
  error.value = null;
  try {
    const response = await fetch(ALLANIME_API_URL);
    if (!response.ok) throw new Error('Erreur réseau');
    animes.value = await response.json();
  } catch (err) {
    error.value = 'Impossible de charger les animes: ' + err.message;
    console.error(err);
  }
}

// click du bouton guess
const guessAnime = () => {
    message.value = '';
    if (guess.value == undefined) {
        message.value = "aucun anime renseigné";
    }
    /*if (guess.value == answer.value.name) {
        console.log("win");
    }*/
    else {
        let i = 0;
        while (i < animes.value.length && animes.value[i].name != guess.value) {
            i++;
        }
        if (i < animes.value.length) {
            let currAnim = animes.value[i];
            allGuess.value.splice(0, 0, [currAnim.id, currAnim.name, currAnim.cover, currAnim.year, currAnim.source, currAnim.studio, currAnim.genres, currAnim.tags]);
        }
        console.log(allGuess.value);
        console.log(answer.value.genres.includes("Action"));
    }

}

const resetGuess = () => {
    allGuess.value = [];
}



onMounted(() => {
    fetchAllAnimes();
    fetchDailyAnime();
});
</script>

<style scoped>

.anidle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5vh;
}

.info {
    background: none;
    border: none;
}

.game_title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1vw;
}

svg {
    color: #fff;
}


.guess {
  position: relative;
  background: var(--bloc1);
  padding: 1.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  border: 4px solid #000;
  height: 8vh;
  transition: all 400ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-style: preserve-3d;
  /*transform: rotateX(10deg) rotateY(-10deg);*/
  perspective: 1000px;
  box-shadow: 1vw 1vh 0 #000;
}

form {
    position: relative;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;

    height: 8vh;
    transition: all 400ms cubic-bezier(0.23, 1, 0.32, 1);
    transform-style: preserve-3d;
    perspective: 1000px;

}

.guess:hover {
  /*transform: rotateX(5deg) rotateY(1 deg) scale(1.05);*/
  box-shadow: 2.5vw 2.5vh 0 -5px var(--yellow), 2.5vw 2.5vh 0 0 #000;
}

.shadow_input {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
  transform: translateZ(-50px);
  background: linear-gradient(
    45deg,
    rgba(255, 107, 107, 0.4) 0%,
    rgba(255, 107, 107, 0.1) 100%
  );
  filter: blur(20px);
}

.input_search {
  outline: none;
  border: 3px solid #000;
  align-self: stretch;
  padding: 1.5vw;
  font-size: 1.1rem;
  background: #fff;
  color: #000;
  transform: translateZ(10px);
  transition: all 400ms cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  z-index: 3;
  font-family: "shonendle";
  letter-spacing: -0.5px;

}

.input_search::placeholder {
  color: var(--gray);
  font-weight: bold;
  text-transform: uppercase;
}

.input_search:hover,
.input_search:focus {
  background: var(--bloc1);
  transform: translateZ(20px) translateX(-5px) translateY(-5px);
  box-shadow: 5px 5px 0 0 #000;
}

.submit_guess {
    border: 3px solid #000;
    align-self: stretch;
    transition: all 400ms cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 3;
    position: relative;
    outline: none;
}

.submit_guess svg {
    color: #000;
}

.submit_guess:hover {
    background: var(--bloc1);
    transform: translateZ(20px) translateX(-5px) translateY(-5px);
    box-shadow: 5px 5px 0 0 #000;
}

.submit_guess:hover svg, .info svg:hover {
    color: red;
}

.submit_guess:active {
    transform: translateZ(2px);
    box-shadow: 5px 5px 0 0 var(--bloc1);
}

.guess::before {
  content: "GUESS TODAY'S ANIME";
  position: absolute;
  width: 50%;
  top: -0.8rem;
  left: 1rem;
  background: var(--yellow);
  color: #000;
  font-weight: bold;
  padding: 0.5vh 1vw;
  font-size: 0.9rem;
  transform: translateZ(50px);
  z-index: 4;
  border: 2px solid #000;
}

.previous_guesses {
    display: flex;
    flex-direction: column;
    gap: 2vh;

}

.previous_guesses > div {
    display: flex;
    gap: 2vw;
    border: 1px solid white;
}

.previous_guesses > div img {
    width: 7.5vw;
    height: 15vh; 
}

.good_answer {
    color: rgb(4, 232, 4);
}

.almost_answer {
    color: orange;
}

.bad_answer {
    color: red;
}

/* ================= TABLE CONTAINER ================= */

table {
  width: 100%;
  max-width: 900px;
  margin: 2rem auto;
  border-collapse: separate;
  border-spacing: 0 1rem;
  table-layout: fixed;
  font-family: "shonendle";
}

/* ================= THEAD ================= */

thead {
  position: relative;
}

thead th {
  background: var(--yellow);
  color: #000;
  border: 3px solid #000;
  padding: 0.8rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 5px 5px 0 #000;
}

/* ================= ROW STYLE ================= */

tbody tr {
  background: #1A2C3D;
  border: 4px solid #000;
  height: 6vh;
  width: calc(100%/6);
  animation: slideRow 0.4s ease forwards;
  opacity: 0;
  transform: translateX(-20px);
  box-shadow: 1vw 1vh 0 #000;
  transition: all 400ms cubic-bezier(0.23, 1, 0.32, 1);
}

/* ================= CELLS ================= */

td {
  padding: 0.8rem;
  text-align: center;
  font-size: 0.9rem;
}

/* coins arrondis subtils */
tbody tr td:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

tbody tr td:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

td img {
    width: 100%;
}

td ul {
    list-style: none;
    padding-left: 0;
}

.anime_title {
    /*display: none;*/
    position: relative; 
    z-index: 2; 
    transform: translate(-50%, -50%);
}

.anime_img_title {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.anime_img_title:hover .overlay {
  opacity: 1;
}

.year {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.year h3 {
    position: relative; 
    z-index: 2; 
}

.arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Centre parfaitement */
    z-index: 1;               /* Derrière le texte */
    opacity: 0.3;             /* Optionnel : effet filigrane */
    width: 20vw;
    height: 20vh; 
}

/* ================= ANIMATION ================= */

@keyframes slideRow {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* animation progressive */
tbody tr:nth-child(1) { animation-delay: 0.05s; }
tbody tr:nth-child(2) { animation-delay: 0.1s; }
tbody tr:nth-child(3) { animation-delay: 0.15s; }
tbody tr:nth-child(4) { animation-delay: 0.2s; }
tbody tr:nth-child(5) { animation-delay: 0.25s; }


</style>