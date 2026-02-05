<template>
  <nav class="nav">
    <RouterLink to="/"><button>Home</button></RouterLink>
    <RouterLink to="/users"><button>Ranking</button></RouterLink>
    <RouterLink to="/"><button>Classic</button></RouterLink>
    <RouterLink to="/"><button>Opening</button></RouterLink>
    <RouterLink to="/"><button>Character</button></RouterLink>
    <RouterLink to="/"><button>Image</button></RouterLink>
  </nav>
</template>

<script>


</script>

<style>



.nav {
  display: flex;
  flex-direction: column;
  width: 15%;
  padding-right: 1vw;
  border: 2px solid black;
  gap: 5vw;
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
}

.nav button:active {
  transform: translate(0.05em, 0.05em);
  box-shadow: 0.05em 0.05em;
}

body {
  background: url(/img/home_wallpaper.jpg) no-repeat fixed;
  color: white;
}

</style>