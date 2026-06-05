<template>
  <div class="anidle">
    <div class="game_title">
      <h1>Classic</h1>
      <button class="info"><Info /></button>
    </div>

    <div class="search_bloc">
        <div class="hint">
            <button v-if="allGuess.length > 10">Hint</button>
        </div>

        <div class="guess" v-if="win == false">
            <div class="shadow_input"></div>
            <form action="" @submit.prevent="guessAnime()">
                <input
                type="text"
                class="input_search"
                v-on:focus="focusOn(); search(guess)"
                v-on:focusout="focusOut()"
                v-on:keypress="search(guess)"
                v-on:keyup.delete="search(guess)"
                ref="input_search"
                placeholder="Enter your guess"
                v-model="guess"
                />
                <button type="submit" class="submit_guess" @click="submit">
                <SendHorizontal />
                </button>
            </form>
        </div>


        <div class="win-card" v-if="win == true">
          <div class="win-card__header">
            <div class="win-card__alert">{{answer.name}}</div>
          </div>
          <div class="win-card__message">
            <img :src="`${answer.cover}`" alt="cover" />
          </div>
          <div class="win-card__actions">
            <div class="win-card-tries">
              <h2>GG you found it in</h2> 
              <h2 class="win-card-tries-nb">{{ allGuess.length }}</h2>
              <h2>tries</h2>
            </div>
            <h2>Next mode :</h2>
            <a class="win-card__button win-card__button--mark" href="#"
              >Opening</a
            >
          </div>
      </div>


        <div class="anime_search" v-if="focus == true" > <!--  -->
            <ul>
                <li v-for="anime in animesSearched" v-on:focus="focusOn">
                <button @mousedown.prevent="searchedClicked(anime.anime.name)">
                    <h3>{{ anime.anime.name }}</h3>
                </button>
                </li>
            </ul>
        </div>
    </div>
    

    <button @click="resetGuess" class="reset">Reset</button>

    <section class="previous_guesses" v-if="allGuess.length > 0">
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
                <img :src="`${anime[2]}`" alt="cover" />
                <div class="overlay">
                  <h3>{{ anime[1] }}</h3>
                </div>
              </div>
            </td>
            <td
              :class="{
                good_answer: anime[3] == answer.year,
                bad_answer: anime[3] != answer.year,
              }"
            >
              <div class="year">
                <h3>{{ anime[3] }}</h3>
                <ArrowBigDown class="arrow" v-if="anime[3] > answer.year" />
                <ArrowBigUp class="arrow" v-else-if="anime[3] < answer.year" />
              </div>
            </td>
            <td
              :class="{
                good_answer: anime[4] == answer.source,
                bad_answer: anime[4] != answer.source,
              }"
            >
              {{ anime[4].replace("_", " ") }}
            </td>
            <td
              :class="{
                good_answer: anime[5] == answer.studio,
                bad_answer: anime[5] != answer.studio,
              }"
            >
              {{ anime[5] }}
            </td>
            <td>
              <ul>
                <li v-for="genre in anime[6]" :key="genre">
                  <h3
                    :class="{
                      good_answer: answer.genres?.includes(genre),
                      bad_answer: !answer.genres?.includes(genre),
                    }"
                  >
                    {{ genre }}
                  </h3>
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="index in 4" :key="index">
                  <h3
                    :class="{
                      good_answer: answer.tags?.slice(0, 4).includes(anime[7][index - 1]),
                      bad_answer: !answer.tags?.includes(anime[7][index - 1]),
                      almost_answer: answer.tags?.includes(anime[7][index - 1], 4),
                    }"
                  >
                    {{ anime[7][index - 1] }}
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
import { Info, SendHorizontal, ArrowBigDown, ArrowBigUp } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { getAllGuesses, getLastGuess, getWin } from "../composable/SessionsVariables.js";
import { searchAnimeByName, searchAnimeWeighted } from "../composable/SearchAnime.js";

const focusOn = () => {
  focus.value = true;
};

const focusOut = () => {
  focus.value = false;
};

const search = (name) => {
  animesSearched.value = searchAnimeWeighted(name, animes.value, allGuess.value.map(function(anime) {return anime[1];}));
};


const searchedClicked = (guessInput) => {
  guessAnime(guessInput);
};
// array contenant les guess de l'utilisateur dans une variable de session
const {array: allGuess} = getAllGuesses();
// boolean contenant si l'utlisateur a gagné l'anidle
const {win} = getWin();

// URLS de l'API du serveur
const DAILYANIME_API_URL = "http://localhost:3000/api/daily";
const ALLANIME_API_URL = "http://localhost:3000/api/anime";

// input de l'utilisateur
const guess = ref();
// réponse du jour
const answer = ref([]);
// tous les animes de la database
const animes = ref([]);
// array contenant le resultat de la recherche
const animesSearched = ref([]);
// search input element
const input_search = ref();

const focus = ref(false);

const error = ref(null);
const message = ref("");

// récupere l'anime du jour
async function fetchDailyAnime() {
  error.value = null;
  try {
    const response = await fetch(DAILYANIME_API_URL);
    if (!response.ok) throw new Error("Erreur réseau");
    answer.value = await response.json();
  } catch (err) {
    error.value = "Impossible de charger le daily anime: " + err.message;
    console.error(err);
  }
}

// récupere tous les animes de la databse
async function fetchAllAnimes() {
  error.value = null;
  try {
    const response = await fetch(ALLANIME_API_URL);
    if (!response.ok) throw new Error("Erreur réseau");
    animes.value = await response.json();
  } catch (err) {
    error.value = "Impossible de charger les animes: " + err.message;
    console.error(err);
  }
}

// click du bouton guess
const guessAnime = (guessInput = guess.value) => {
  guess.value = guessInput;
  message.value = "";
  // si aucun anime renseigné
  if (guess.value == undefined) {
    message.value = "aucun anime renseigné";
  }
  // si l'anime est la bonne réponse
  if (guess.value == answer.value.name) {
    allGuess.value.splice(0, 0, [
      answer.value.id,
      answer.value.name,
      answer.value.cover,
      answer.value.year,
      answer.value.source,
      answer.value.studio,
      answer.value.genres,
      answer.value.tags,
    ]);
    guess.value = "";
    win.value = true;
  } 
  // si l'anime n'est pas la bonne réponse
  else {
    let i = 0;
    while (i < animes.value.length && animes.value[i].name != guess.value) {
      i++;
    }
    if (i < animes.value.length) {
      let currAnim = animes.value[i];
      allGuess.value.splice(0, 0, [
        currAnim.id,
        currAnim.name,
        currAnim.cover,
        currAnim.year,
        currAnim.source,
        currAnim.studio,
        currAnim.genres,
        currAnim.tags,
      ]);
    }
    guess.value = "";
    input_search.value.blur();
  }
  console.log(allGuess);
};

const resetGuess = () => {
  allGuess.value = [];
  win.value = false;
};

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

.reset {
  margin-top: 5vh;
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

.submit_guess:hover svg,
.info svg:hover {
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

/* =================  ANIME SEARCH ================= */

.search_bloc {
  position: relative;
}

.anime_search {
  width: 100%;
  z-index: 10;
  position: absolute;
}

.anime_search ul {
  scrollbar-width: none;
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  max-height: 40vh;
  overflow: hidden;
  overflow-y: scroll;
}

.anime_search ul li button {
  width: 100%;
  background-color: #F0F0F0;
	border: none;
	cursor: pointer;
	outline: inherit;
}

.anime_search ul li button:hover {
  background-color: #36597B;
}

/* =================  ANSWER COLOR CORRESPONDANCE ================= */

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
  background: #1a2c3d;
  height: 6vh;
  width: calc(100% / 6);
  animation: slide-right 0.5s ease-in-out both;
  box-shadow: 0.5vw 1vh #000;
}

/* ================= CELLS ================= */

td {
  padding: 0.8rem;
  text-align: center;
  font-size: 0.9rem;
  border-right: 3px solid black;
  /*animation: flip-vertical-left 0.4s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;*/
}

td li h3 {
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

.anime_img_title {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.overlay {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay h3 {
  font-size: 0.8rem;
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
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0.3;
  width: 10vw;
  height: 15vh;
}



/* ================= WIN CARD ================== */

.win-card {
  border: 4px solid #000;
  background-color: var(--blue-background);
  padding: 1.5rem;
  box-shadow: 10px 10px 0 #000;
  font-family: "Arial", sans-serif;
  text-align: center;
}

.win-card__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #000;
  padding-bottom: 1rem;
}


.win-card__alert {
  font-weight: 900;
  color: #fff;
  font-size: 1.5rem;
  text-transform: uppercase;
}

.win-card__message {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.4;
  padding-bottom: 1rem;
  font-weight: 600;
}

.win-card img {
  width: 12rem;
}

.win-card-tries {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: center;
  border-bottom: 2px solid #000;
}

.win-card-tries-nb {
  color: green;
}

.win-card__actions {
  margin-top: 1rem;
}

.win-card__button {
  display: block;
  padding: 0.75rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 3px solid #000;
  background-color: #fff;
  color: #000;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 5px 5px 0 #000;
  overflow: hidden;
  text-decoration: none;
  margin-bottom: 1rem;
}

.win-card__button--read {
  background-color: #000;
  color: #fff;
}

.win-card__button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: all 0.6s;
}

.win-card__button:hover::before {
  left: 100%;
}

.win-card__button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 #000;
}

.win-card__button--mark:hover {
  background-color: var(--yellow);
  border-color: var(--yellow);
  color: #fff;
  box-shadow: 7px 7px 0 #fff;
}

.win-card__button--read:hover {
  background-color: #ff0000;
  border-color: #ff0000;
  color: #fff;
  box-shadow: 7px 7px 0 #800000;
}

.win-card__button:active {
  transform: translate(5px, 5px);
  box-shadow: none;
}


/* ================= ANIMATION ================= */

@keyframes slide-right {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes flip-vertical-left {
  0% {
    transform: rotateY(-180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
</style>
