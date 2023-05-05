<template>
    <div class="container">
      <h2 class="title">John Wick 4</h2>
      <div class="video-wrapper">
        <iframe
          class="video"
          src="https://www.youtube.com/embed/jFsWkFnZfXk"
          frameborder="0"
          allowfullscreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
      <div class="info-container">
        <div class="info-item">
          <img class="info-svg" src="https://www.svgrepo.com/show/490607/calendar-event.svg" />
          <p>Data premiery: 24 marca 2023</p>
        </div>
        <div class="info-item">
          <img class="info-svg" src="https://www.svgrepo.com/show/513817/clock.svg" />
          <p>Czas trwania: 99 minut</p>
        </div>
      </div>
      <div class="bottom-container" :style="styleObject">
        <div class="description">
            Keanu Reeves powraca, by stanąć do decydującej walki z błyskotliwym i
          bezlitosnym Billem Skarsgardem, który pokazał już swoje mroczne oblicze
          w przerażającym „TO”. O wolność na ubitej ziemi Nowego Jorku, Paryża,
          Tokio i Berlina. Ceny idą w górę, więc także stawka za głowę
          legendarnego zabójcy, Johna Wicka przebiła już sufit. Stając do
          ostatecznego pojedynku, który może dać mu upragnioną wolność i
          zasłużoną emeryturę, John wie, że może liczyć tylko na siebie. Dla
          niego, to nic nowego. To co zmieniło się tym razem, to fakt, że
          przeciwko sobie ma całą międzynarodową organizację najlepszych płatnych
          zabójców, a jej nowy szef Markiz de Gramond jest równie wyrafinowany, co
          bezlitosny. Zanim John stanie z nim oko w oko, będzie musiał odwiedzić
          kilka kontynentów mierząc się z całą plejadą twardzieli, którzy wiedzą
          wszystko o zabijaniu. Tuż przed wielkim finałem tej morderczej symfonii,
          John Wick trafi na trop swojej dalekiej rodziny, której członkowie mogą
          mieć decydujący wpływ na wynik całej rozgrywki.
        </div>
        <div class="movie-image">
          <img src="https://cdn.gracza.pl/galeria/mdb/f/3448000.jpg" alt="Zdjęcie filmu" />
        </div>
      </div>
    </div>
  </template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const windowWidth = ref(window.innerWidth)

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

const styleObject = computed(() => {
  const baseStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  }

  if (windowWidth.value <= 800) {
    baseStyle.flexWrap = 'wrap'
  } else {
    baseStyle.flexWrap = 'nowrap'
  }

  return baseStyle
})
</script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: white;
  }
  
  .title {
    font-size: 27px;
    font-weight: bold;
    padding: 75px 0;
  }
  
  .video-wrapper {
    position: relative;
    padding-bottom: 62.5%;
    height: 0;
    width: 100%;
  }
  
  .video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .info-container {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    padding: 55px 0 60px;
  }
  
  .info-item {
    display: flex;
    align-items: center;
  }
  
  .info-svg {
    width: 30px;
    margin-right: 10px;
  }
  
  .bottom-container {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
    padding-bottom: 150px;
  }

  .description {
    text-align: justify;
    padding-right: 30px;
    flex: 1;
  }

  .movie-image {
    width: 300px;
    height: 450px;
    overflow: hidden;
  }

  .movie-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media screen and (max-width: 800px) {
    .description {
      order: 2;
      padding-right: 0;
      padding-top: 30px;
    }
    .movie-image {
      order: 1;
      width: 100%;
      height: auto;
      padding-top: 30px;
    }
    .movie-image img {
      height: auto;
    }
  }
  </style>