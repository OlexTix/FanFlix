<template>
    <div class="location-wrapper">
      <RouterLink to="#" class="cinema-info" v-if="selectedCinema">
        <fa-icon icon="fa-map-marker-alt" class="location-icon"></fa-icon>
        <p class="cinema-name">{{ selectedCinema }}</p>
      </RouterLink>
      <RouterLink to="#" class="cinema-info" v-else>
        <p class="cinema-name">Wybierz kino</p>
      </RouterLink>
    </div>
  </template>
  
  <script>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue';

export default {
  name: 'NavbarLocationInfo',
  setup() {
    const selectedCinema = ref(null);

    onMounted(() => {
      const selectedCinemaObj = JSON.parse(localStorage.getItem("selectedCinema"));
      if (selectedCinemaObj) {
        selectedCinema.value = `${selectedCinemaObj.city} - ${selectedCinemaObj.name}`
      }
    });

    return {
      selectedCinema
    }
  }
}
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