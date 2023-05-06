<template>
    <div class="location-wrapper">
      <RouterLink :to="`/cinemas/${selectedCinemaObj.name}/screenings`" class="cinema-info" v-if="selectedCinemaObj">
        <fa-icon icon="fa-map-marker-alt" class="location-icon"></fa-icon>
        <p class="cinema-name">{{ selectedCinemaObj.city }} - {{ selectedCinemaObj.name }}</p>
      </RouterLink>
      <RouterLink to="/cinemas/select-cinema/screenings" class="cinema-info" v-else>
        <fa-icon icon="fa-hand" class="location-icon"></fa-icon>
        <p class="cinema-name">Wybierz kino</p>
      </RouterLink>
    </div>
  </template>
  
  <script>
  import { RouterLink } from 'vue-router';
  
  export default {
    name: 'NavbarLocationInfo',
    data() {
      return {
        selectedCinemaObj: null,
      };
    },
    mounted() {
      this.updateSelectedCinema();
      this.emitter.on('updateSelectedCinema', () => {
        this.updateSelectedCinema();
      });
    },
    beforeUnmount() {
      this.emitter.off('updateSelectedCinema');
    },
    methods: {
      updateSelectedCinema() {
        this.selectedCinemaObj = JSON.parse(localStorage.getItem("selectedCinema"));
      },
    },
  };
  </script>

<style scoped>
.location-wrapper {
  margin-left: auto;
}

.cinema-info {
  display: flex;
  color: white;
}

.location-icon {
  margin-right: 10px;
  font-size: 25px;
}

.cinema-name {
  font-weight: 700;
  font-size: 1rem;
}
</style>