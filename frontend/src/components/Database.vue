<template>
    <section class="all_anime">
        <div v-for="anime in animes" :key="anime.id">
            <h2>{{anime.name}}</h2>
            <img :src="`${anime.cover}`" :alt="`${anime.name}`" >
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000/api/anime'
const animes = ref([])
const loading = ref(false)
const error = ref(null)

async function fetchAnimes() {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Erreur réseau')
    animes.value = await response.json()
  } catch (err) {
    error.value = 'Impossible de charger les animes: ' + err.message
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnimes()
});

</script>

<style scoped>

.all_anime {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5vw;

}

.all_anime div {
    width: 10vw;
    height: 35vh;
    margin: 2vh 2vw 2vh 2vw;
}

div img {
    width: 10vw;
    height: 30vh;
}

h2 {
    size: 0.6rem;
    text-wrap: wrap;
}



</style>