<template>
  <Navbar />
  <BaseTemplate>
    <ScreeningsFilterComponent @selected-data-changed="onFilterDataChanged" />
    <ScreeningsTileComponent v-for="movie in movies" :movie="movie" />
  </BaseTemplate>
</template>

<script>
import ScreeningsFilterComponent from '../components/screenings/ScreeningsFilterComponent.vue';
import ScreeningsTileComponent from '../components/screenings/ScreeningsTileComponent.vue';
import Navbar from '../components/Navbar.vue';
import BaseTemplate from '../components/templates/BaseTemplate.vue';

export default {
  components: {
    ScreeningsFilterComponent,
    ScreeningsTileComponent,
    Navbar,
    BaseTemplate,
  },
  data() {
    return {
      movies: [],
    };
  },
  methods: {
    onFilterDataChanged({ cinema, date }) {
      this.fetchScreenings(cinema, date);
    },
    async fetchScreenings(selectedCinema, selectedDate) {
      try {
        const response = await this.$http.get(`/api/cinemas/${selectedCinema}/screenings?date=${selectedDate}`);
        this.movies = response.data;
        console.log('Otrzymane seanse:', this.movies);
      } catch (error) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: `Błąd podczas pobierania seansów.`, life: 3000 });
        console.error('Błąd podczas pobierania seansów:', error.message, error.response);
      }
    },
  },
};
</script>