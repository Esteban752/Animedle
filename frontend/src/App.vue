<template>
  <Header/>
  <div class="container">
    <RouterView/>
  </div>
  
</template>

<script setup>
import Header from './components/NavBar.vue';



</script>

<style>
@font-face {
    font-family: "Shonendle";
    src: url("/fonts/shonen/Shonen\ \(Namikus\).otf");
}
@font-face {
    font-family: "Shonendle-bold";
    src: url("/fonts/shonen/Shonen\ Bold\ \ \(Namikus\).otf");
}
@font-face {
    font-family: "Shonendle-bold-italic";
    src: url("/fonts/shonen/Shonen\ Bold\ Italic\ \(Namikus\).otf");
}
@font-face {
    font-family: "Shonendle-italic";
    src: url("/fonts/shonen/Shonen\ Italic\ \(Namikus\).otf");
}

:root {
  --yellow: #e9b50b;
  --yellow-background: #e4c45c;
  --bloc1: #f0f0f0;
  --gray: #666;
}

.container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-left: 15%;
}

#app {
  display: flex;
  
}

body {
  margin: 0;
  background: url(/img/home_wallpaper.jpg) no-repeat fixed;
  color: white;
}

h1{
  font-size: 30px;
  text-transform: uppercase;
  font-weight: 300;
  text-align: center;
  margin-bottom: 15px;
  font-family: 'Shonendle-bold';
}

</style>