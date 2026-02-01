<template>
  <header class="header">
    <RouterLink to="/"><button><span>Home</span></button></RouterLink>
    <RouterLink to="/users"><button><span>Users</span></button></RouterLink>
    <RouterLink to="/game"><button><span>Game</span></button></RouterLink>
  </header>
</template>

<script>


</script>

<style>
@font-face {
    font-family: "Shonendle";
    src: url("../../dist/assets/shonen/Shonen\ \(Namikus\).otf");
}
@font-face {
    font-family: "Shonendle-bold";
    src: url("../../dist/assets/shonen/Shonen\ Bold\ \ \(Namikus\).otf");
}
@font-face {
    font-family: "Shonendle-bold-italic";
    src: url("../../dist/assets/shonen/Shonen\ Bold\ Italic\ \(Namikus\).otf");
}
@font-face {
    font-family: "Shonendle-italic";
    src: url("../../dist/assets/shonen/Shonen\ Italic\ \(Namikus\).otf");
}
.header {
  display: flex;
  flex-direction: row;
  gap: 5vw;
}

.header a {
  text-decoration: none;
}

.header button {
  align-items: center;
  background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  border: 0;
  border-radius: 8px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  font-size: 18px;
  justify-content: center;
  line-height: 1em;
  max-width: 100%;
  min-width: 140px;
  padding: 3px;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s;
}

.header button:active, .header button:hover {
  outline: 0;
}

.header button span {
  background-color: rgb(5, 6, 45);
  font-family: 'Shonendle';
  padding: 16px 24px;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  transition: 300ms;
}

.header button:hover span {
  background: none;
}

.header button:active {
  transform: scale(0.9);
}

</style>