<template>
    <div class="container" v-if="movie">
      <h2 class="title">{{ movie.title }}</h2>
      <div class="video-wrapper">
        <iframe
          class="video"
          :src="'https://www.youtube.com/embed/' + extractVideoId(movie.youtube_link)"
          frameborder="0"
          allowfullscreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
      <div class="info-container">
        <div class="info-item">
          <img class="info-svg" src="../assets/calendar.svg" />
          <p>Data premiery: {{ formatDate(movie.release_date) }}</p>
        </div>
        <div class="info-item">
          <img class="info-svg" src="../assets/clock.svg" />
          <p>Czas trwania: {{ movie.duration }} min</p>
        </div>
        <div class="info-item">
          <img class="info-svg" src="../assets/director-chair.svg" />
          <p>Reżyser: {{ movie.first_name }} {{ movie.last_name }}</p>
        </div>
      </div>
      <div class="info-container-genre">
        <div class="info-item">
          <img class="info-svg-2" src="../assets/skin-mask.svg"/>
          <p>Gatunek: 
            <span v-for="(genre, index) in movie.genres" :key="index">
              {{ genre }}<span v-if="index < movie.genres.length - 1">, </span>
            </span>
          </p>
        </div>
      </div>
      <div class="bottom-container" :style="styleObject">
        <div class="description"> {{ movie.description }} </div>
        <div class="movie-image">
          <img :src=movie.poster_url alt="Zdjęcie filmu" />
        </div>
      </div>
    </div>
    <div v-else>Loading...</div>
  </template>

<script>
import { computed } from 'vue';

export default {
  data() {
    return {
      windowWidth: window.innerWidth,
      movie: null,
    };
  },
  computed: {
    movieTitle() {
      return this.$route.params.nazwaFilmu;
    },
    styleObject() {
      const baseStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      };

      if (this.windowWidth <= 800) {
        baseStyle.flexWrap = 'wrap';
      } else {
        baseStyle.flexWrap = 'nowrap';
      }

      return baseStyle;
    },
  },
  methods: {
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
    async fetchMovieData() {
      const response = await this.$http.get(`/api/movies?title=${this.movieTitle}`);
      this.movie = response.data[0];
      console.log('Otrzymany film:', this.movie);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    },
    extractVideoId(url) {
      const videoIdPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
      const match = url.match(videoIdPattern);
      return match ? match[1] : null;
    },
  },
  mounted() {
    window.addEventListener('resize', this.updateWindowWidth);
    this.fetchMovieData();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth);
  },
};
</script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: var(--color-text);
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
    padding-top: 55px;
  }

  .info-container-genre {
    display: flex;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 30px;
    justify-content: center;
  }
  
  .info-item {
    margin: 5px;
    display: flex;
    align-items: center;
  }
  
  .info-svg {
    width: 30px;
    margin-right: 15px;
    filter: var(--color-logo);
  }

  .info-svg-2 {
    width: 50px;
    margin-right: 15px;
    filter: var(--color-logo);
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