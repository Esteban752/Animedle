<template>
  <div class="user-list">
    <h1>Liste des utilisateurs</h1>
    
    <!-- Formulaire d'ajout -->
    <div class="add-user">
      <input v-model="newUser.name" placeholder="Nom" />
      <button @click="addUser">Ajouter</button>
    </div>
    
    <!-- Affichage des erreurs -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Loading -->
    <div v-if="loading">Chargement...</div>

    <!-- Liste des utilisateurs -->
    <div v-else class="users">
      <div class="tbl-header">
        <table cellpadding="0" cellspacing="0" border="0">
          <thead>
            <tr>
              <th>PP</th>
              <th>ID</th>
              <th>Username</th>
              <th>Score</th>
              <th>Delete</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="tbl-content">
        <table cellpadding="0" cellspacing="0" border="0">
          <tbody>
            <tr v-for="user in users" :key="user.id" v-bind:class="`user-card-${user.id}`">
              <td>PP</td>
              <td>{{user.id}}</td>
              <td>{{user.username}}</td>
              <td>{{user.score}}</td>
              <td><button @click="deleteUser(user.id)">delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(false)
const error = ref(null)
const newUser = ref({ name: '',score: 0})

// URL de l'API (ajustez selon votre config)
const API_URL = 'http://localhost:3000/api/users'

// Récupérer tous les utilisateurs
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

// Ajouter un utilisateur
async function addUser() {
  try {

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newUser.value.name,
        score: newUser.value.score,
      })
    })

    if (!response.ok) throw new Error('Erreur lors de la création')

    // Rafraîchir la liste
    await fetchUsers()
    
    // Réinitialiser le formulaire
    newUser.value.name = ''
  } catch (err) {
    error.value = 'Impossible d\'ajouter l\'utilisateur: ' + err.message
    console.error(err)
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression')
    }

    // Rafraîchir la liste
    await fetchUsers()
  } catch (err) {
    error.value = 'Impossible de supprimer l\'utilisateur: ' + err.message
    console.error(err)
  }
}

// Charger les données au montage du composant
onMounted(() => {
  fetchUsers()
});
</script>

<style scoped>

.user-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  gap: 2vh;
}

.add-user {
  display: flex;
  gap: 1vw;
}

.users {
  background: -webkit-linear-gradient(left, #25c481, #25b7c4);
  background: linear-gradient(to right, #25c481, #25b7c4);
}

table{
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  width:100%;
  table-layout: fixed;
}
.tbl-header{
  background-color: rgba(255,255,255,0.3);
 }
.tbl-content{
  height: 30vh;
  overflow-x:auto;
  margin-top: 0px;
  border: 1px solid rgba(255,255,255,0.3);
}
th{
  padding: 2vh;
  text-align: left;
  font-weight: 500;
  font-size: 0.8rem;
  color: #fff;
  text-transform: uppercase;
}
td{
  padding: 2vh;
  text-align: left;
  vertical-align:middle;
  font-weight: 300;
  font-size: 0.8rem;
  color: #fff;
  border-bottom: solid 1px rgba(255,255,255,0.1);
}


/* for custom scrollbar for webkit browser*/

::-webkit-scrollbar {
    width: 0.375rem;
} 
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0.375rem rgba(0,0,0,0.3); 
} 
::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 0.375rem rgba(0,0,0,0.3); 
}
</style>