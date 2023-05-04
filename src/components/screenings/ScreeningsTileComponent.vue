<template>
    <div class="repertoire-tile">
      <div class="poster-container">
        <img src="https://www.monolith.pl/wp-content/uploads/2023/02/john-wick-4-jw4-2025x3000-online-character-1sht-keanu-v1-pl-864x1280.jpg" alt="Film poster" class="poster" />
      </div>
      <div class="info-container">
        <h1 class="film-title">{{ screening.title }}</h1>
        <div class="film-genres">
          <span>Thriller</span> | <span>Akcja</span>
        </div>
        <p class="film-duration">{{ screening.duration }} min</p>
        <div class="film-screenings">
          <ScreeningsType v-for="item in screening.screenings" :key="item.time" :time="item.time" :type="item.language" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ScreeningsType from '../screenings/ScreeningsTypeComponent.vue';

  export default {
    name: 'ScreeningsTileComponent',
    props: {
      screening: {
        type: Object,
        required: true,
      },
    },
    components: {
      ScreeningsType,
  },
  };
  </script>
  
  <style>
  .repertoire-tile {
    display: flex;
  }
  
  .poster-container {
    width: 223px;
    height: 330px;
  }
  
  .poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .info-container {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
  }
  
  .film-title {
    font-size: 24px;
    font-weight: 800;
  }
  
  .film-genres {
    margin-top: 10px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
  }
  
  .film-genres span {
    margin-right: 6px;
    margin-left: 6px;
  }
  
  .film-duration {
    margin-top: 10px;
    margin-left: 5px;
    font-size: 16px;
    font-weight: 100;
  }
  
  .film-screenings {
    margin-top: 20px;
    display: flex;
  }
  </style>