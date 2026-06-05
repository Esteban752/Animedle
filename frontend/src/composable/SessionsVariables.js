import { ref, watch } from 'vue';

const ALL_GUESSES = "AllGuesses";
const LAST_GUESS = "LastGuess";
const WIN = "Win";


// Initialisation depuis localStorage
const allguess_session = localStorage.getItem(ALL_GUESSES);
const lastguess_session = localStorage.getItem(LAST_GUESS);
const win_session = localStorage.getItem(WIN);

const array = ref(allguess_session ? JSON.parse(allguess_session) : []);
const date = ref(lastguess_session ? new Date(lastguess_session) : new Date())
const win = ref(win_session ? win_session === 'true' : false)


// Sauvegarde automatique à chaque modification
watch(array, (newValue) => {
    localStorage.setItem(ALL_GUESSES, JSON.stringify(newValue))
}, { deep: true })

export function getAllGuesses() {
    return {
        array
    }
}

watch(date, (newValue) => {
    if (newValue instanceof Date) {
        localStorage.setItem(LAST_GUESS, newValue.toISOString())
    } else {
        localStorage.removeItem(LAST_GUESS)
    }
})

export function getLastGuess() {
    return {
        date
    }
}


watch(win, (newValue) => {
    localStorage.setItem(WIN, String(newValue))
})

export function getWin() {
    return {
        win
    }
}

