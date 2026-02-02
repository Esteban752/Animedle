<template>
<div>
    <h1>Bienvenue sur Shonendle</h1>
    <div class="games_btn">
        <RouterLink to="/anidle">
          <div @mouseenter="playVideo(classic)" @mouseleave="pauseVideo(classic)" class="classic_div">
            <video muted loop playsinline ref="classic">
              <source src="/videos/onepiece_background.mp4" type="video/mp4">
            </video>
            <span>Classic</span><p>guess the anime with clues</p>
          </div>
        </RouterLink>
        <RouterLink to="/opening">
          <div @mouseenter="playVideo(opening)" @mouseleave="pauseVideo(opening)" class="opening_div">
            <video muted loop playsinline ref="opening">
              <source src="/videos/frieren_background.mp4" type="video/mp4">
            </video>
            <span>Opening</span><p>guess the anime with an opening</p>
          </div>
        </RouterLink>
        <RouterLink to="/character"><div><img src="" alt=""><span>Character</span><p>guess the character with an image</p></div></RouterLink>
        <RouterLink to="/image"><div><img src="" alt=""><span>Image</span><p>guess the anime with an image</p></div></RouterLink>

    </div>
</div>
</template>

<script setup>
import {  ref } from 'vue';

const classic = ref()
const opening = ref()

function playVideo(videoRef) {
  if (videoRef) {
    videoRef.play()
  }
}

function pauseVideo(videoRef) {
  if (videoRef) {
    videoRef.pause()
  }
}

</script>

<style>

.container {
  display: flex;
  flex-direction: column;
}

.container > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.games_btn {
    font-family: 'shonendle-bold';
    text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
    display: flex;
    flex-direction: column;
    gap: 5vh;
    align-items: center;
    justify-content: center;
    width: 30%;
    padding: 5%;
    border: 2px solid rgb(193, 163, 98);
    background-color: rgba(193, 163, 98,0.2);
    border-radius: 5%;
}

.games_btn a {
    text-decoration: none;
    width: 100%;
    cursor: pointer;
    position: relative;
    padding: 10px 24px;
    color: rgb(193, 163, 98);
    border: 2px solid rgb(193, 163, 98);
    border-radius: 34px;
    background-color: transparent;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
    overflow: hidden;
    z-index: 10;
}

.games_btn a div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.games_btn a div p {
    font-family: 'shonendle';
    font-size: 0.7rem;
    
}



.games_btn a::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 50px;
  height: 50px;
  border-radius: inherit;
  scale: 0;
  z-index: -1;
  background-color: rgb(193, 163, 98);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.games_btn a:hover::before {
  scale: 3;
}

.games_btn a:hover {
  scale: 1.1;
}

.games_btn a:active {
  scale: 1;
}

video {
  width: 100%;
  position: absolute;
  object-fit: cover;
  z-index: -1;
}

.classic_div video {
  -webkit-transform:translateY(5%);
  -ms-transform:translateY(5%);/*For IE9*/
  transform:translateY(5%);
}

.opening_div video {
  -webkit-transform:translateY(-7%);
  -ms-transform:translateY(-7%);/*For IE9*/
  transform:translateY(-7%);
}

</style>

