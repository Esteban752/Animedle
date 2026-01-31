<template>
    <div class="user-list">
    <h1>Liste des utilisateurs</h1>
    
    <!-- Formulaire d'ajout -->
    <div class="add-user">
      <input v-model="newUser.name" placeholder="Nom" />
      <input v-model="friendInput" placeholder="Amis (séparés par des virgules)" />
      <button @click="addUser">Ajouter</button>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Loading -->
    <div v-if="loading">Chargement...</div>

    <!-- Liste des utilisateurs -->
    <div v-else class="users">
      <div v-for="user in users" :key="user.id" class="user-card">
        <h3>{{ user.name }}</h3>
        <p v-if="user.friends && user.friends.length">
          Amis: {{ user.friends.join(', ') }}
        </p>
        <p v-else>Aucun ami</p>
        <small>ID: {{ user.id }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
const API_URL = 'http://localhost:3000/api/users'

async function fetchUsers() {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Erreur réseau')
    users.value = await response.json()
  } catch (err) {
    error.value = 'Impossible de charger les utilisateurs: ' + err.message
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style>
</style>