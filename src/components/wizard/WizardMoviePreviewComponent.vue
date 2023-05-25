<template>
    <div v-if="movie" class="container" >
      <img class="image" :src="movie.poster_url" alt="Movie Image" />
      <div class="content">
        <h1 class="title">{{ movie.title }}</h1>
        <p class="date">{{ formatDate(screeningData.date) }}</p>
        <p class="date">godzina {{ formatTime(screeningData.time) }}</p>
        <div class="info-container">
          <div class="left-info">
            <p class="left-info-item">{{ screeningData.city }}</p>
            <p class="left-info-item">{{ screeningData.name }}</p>
            <p class="left-info-item">Sala nr {{ screeningData.hall_number }}</p>
            <p class="left-info-item">{{ screeningData.language }}</p>
          </div>
            <div class="right-info">
              <div class="info-item">
                <img class="icon" src="../../assets/calendar.svg" alt="Icon" />
                <div>
                  <span>Data premiery:</span>
                  <span>{{ formatDate2(movie.release_date) }}</span>
                </div>
              </div>
              <div class="info-item">
                <img class="icon" src="../../assets/clock.svg" alt="Icon" />
                <div>
                  <span>Czas trwania:</span>
                  <span>{{ movie.duration }} minut</span>
                </div>
              </div>
            </div>
        </div>
        <div class="description-container">
          <p class="description">{{ movie.description }}</p>
          <RouterLink :to="`/movies/${movie.title}`" class="go-to-movie">Przejdź do filmu</RouterLink>
        </div>
    </div>
    <div v-if="!movie" class="loader-container">
      <span>Wczytywanie danych...</span>
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: 'WizardMoviePreviewComponent',
    data() {
      return {
        movie: null,
      };
    },
    props: {
        screeningData: {
        type: Object,
        required: true,
      },
    },
    methods: {
    async fetchMovieData() {
      const screeningID = this.$route.query.screeningID;
      const response = await this.$http.get(`/api/movies?id=${this.screeningData.id_movie}`);
      this.movie = response.data[0];
      console.log('Otrzymany film:', this.movie);
    },
    formatDate(date) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('pl-PL', options);
    },
    formatDate2(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('pl-PL', options);
    },
    formatTime(time) {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    },
  },
  mounted() {
    this.fetchMovieData();
  },
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    height: 320px;
  }
  
  .image {
    max-height: 320px;
    height: 100%;
    object-fit: cover;
  }
  
  .content {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    word-wrap: break-word;
    margin-top: 0;
  }
  
  .date {
    font-size: 18px;
  }
  
  .info-container {
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
  
  .left-info,
  .right-info {
    display: flex;
    flex-direction: column;
  }
  
  .left-info-item {
    font-size: 14px;
  }
  
  .right-info .info-item {
    display: flex;
    align-items: center;
  }

  .info-item {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .right-info .info-item div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 15px;
    filter: var(--color-logo);
  }

  .description-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: justify;
  }
  
  .go-to-movie {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    text-decoration: underline;
    font-size: 16px;
  }

  @media (max-width: 767px) {
    .left-info {
      flex-direction: row;
    }

    .right-info {
      flex-direction: row;
      gap: 20px;
    }

    .info-container {
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-start;
    }

    .left-info-item {
      margin-right: 10px;
    }

    .image {
        flex-shrink: 1;
        max-width: 20%;
    }
  }
</style>