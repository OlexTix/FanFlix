<template>
  <Navbar />
  <BaseTemplate>
    <ScreeningsFilterComponent @selected-data-changed="onFilterDataChanged" />
    <ScreeningsTileComponent v-for="movie in movies" :key="movie.id" :movie="movie" />
    <ScreeningsEmptyComponent v-if="movies.length === 0" />
  </BaseTemplate>
</template>

<script>
import ScreeningsFilterComponent from '../components/screenings/ScreeningsFilterComponent.vue';
import ScreeningsTileComponent from '../components/screenings/ScreeningsTileComponent.vue';
import ScreeningsEmptyComponent from '../components/screenings/ScreeningsEmptyComponent.vue';
import Navbar from '../components/Navbar.vue';
import BaseTemplate from '../components/templates/BaseTemplate.vue';

export default {
  components: {
    ScreeningsFilterComponent,
    ScreeningsTileComponent,
    ScreeningsEmptyComponent,
    Navbar,
    BaseTemplate,
  },
  data() {
    return {
      movies: []
    };
  },
  methods: {
    onFilterDataChanged({ cinema, date }) {
      this.fetchScreenings(cinema, date);
    },
    async fetchScreenings(selectedCinema, selectedDate) {
      try {
        const response = await this.$http.get(`/api/cinemas/${selectedCinema}/screenings?date=${selectedDate}`);
        if (response.data.message === 'Screenings not found') {
          this.movies = [];
          console.warn('Brak seansów na wybrany dzień.');
        } else {
          this.movies = response.data;
          console.log('Otrzymane seanse:', this.movies);
        }
      } catch (error) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: `Błąd podczas pobierania seansów.`, life: 3000 });
        console.error('Błąd podczas pobierania seansów:', error.message, error.response);
      }
    },
  },
};
</script>