<template>
  <nav class="nav">
    <div>
      <img src="" alt="Logo">
    </div>
    <div>
      <RouterLink to="/"><button>Home</button></RouterLink>
      <RouterLink to="/users"><button>Ranking</button></RouterLink>
    </div>
    <div>
      <RouterLink to="/anidle"><button>Classic</button></RouterLink>
      <RouterLink to="/opening"><button>Opening</button></RouterLink>
      <RouterLink to="/"><button>Character</button></RouterLink>
      <RouterLink to="/"><button>Image</button></RouterLink>
      <RouterLink to="/database"><button>Database</button></RouterLink>
    </div>

  </nav>
</template>

<script>


</script>

<style>



.nav {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 15%;
  height: 100%;
  padding-right: 1vw;
  border: 2px solid black;
  gap: 5vh;
}

.nav a {
  text-decoration: none;
}


.nav button {
  width: 100%;
  background: var(--yellow);
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
}

.nav button:hover {
  transform: translate(-0.05em, -0.05em);
  box-shadow: 0.15em 0.15em;
  background-color: var(--yellow-background);
}

.nav button:active {
  transform: translate(0.05em, 0.05em);
  box-shadow: 0.05em 0.05em;
}



</style>