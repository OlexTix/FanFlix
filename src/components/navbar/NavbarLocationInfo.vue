<template>
    <div class="location-wrapper">
      <RouterLink to="#" class="cinema-info" v-if="selectedCinema">
        <fa-icon icon="fa-map-marker-alt" class="location-icon"></fa-icon>
        <p class="cinema-name">{{ selectedCinema }}</p>
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
        selectedCinema: null,
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
        const selectedCinemaObj = JSON.parse(localStorage.getItem("selectedCinema"));
        if (selectedCinemaObj) {
          this.selectedCinema = `${selectedCinemaObj.city} - ${selectedCinemaObj.name}`;
        }
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