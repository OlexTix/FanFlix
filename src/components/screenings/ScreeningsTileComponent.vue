<template>
    <div class="repertoire-tile">
      <div class="poster-container">
        <RouterLink :to="`/movies/${movie.title}`">
          <img :src="movie.poster_url" alt="Film poster" class="poster" />
        </RouterLink>
      </div>
      <div class="info-container">
        <RouterLink :to="`/movies/${movie.title}`">
          <h1 class="film-title">{{ movie.title }}</h1>
        </RouterLink>
        <div class="film-genres">
          <div v-for="(genre, index) in movie.genres" :key="index">
            <span>{{ genre }}</span>
            <span v-if="index !== movie.genres.length - 1"> | </span>
          </div>
        </div>
        <p class="film-duration">{{ movie.duration }} min</p>
        <div class="film-screenings">
          <ScreeningsType 
            v-for="item in movie.screenings" 
            :key="item.time" 
            :time="item.time" 
            :type="item.language" 
            :screeningID="item.id_screening" />
        </div>
      </div>
    </div>
    <Spacer />
  </template>
  
  <script>
  import { RouterLink } from 'vue-router';
  import ScreeningsType from '../screenings/ScreeningsTypeComponent.vue';
  import Spacer from '../screenings/ScreeningsSpacerComponent.vue';

  export default {
    name: 'ScreeningsTileComponent',
    props: {
      movie: {
        type: Object,
        required: true,
      },
    },
    components: {
      ScreeningsType,
      Spacer,
      RouterLink,
  },
  };
  </script>
  
  <style scoped>
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