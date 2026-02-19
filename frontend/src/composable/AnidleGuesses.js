import { ref, watch } from 'vue';

const ALL_GUESSES = "AllGuesses";

// Initialisation depuis localStorage
const stored = localStorage.getItem(ALL_GUESSES);

const array = ref(stored ? JSON.parse(stored) : [])

// Sauvegarde automatique à chaque modification
watch(array, (newValue) => {
    localStorage.setItem(ALL_GUESSES, JSON.stringify(newValue))
}, { deep: true })

export function getAllGuesses() {
    return {
        array
    }
}