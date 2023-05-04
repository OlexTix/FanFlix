<template>
  <Navbar />
  <BaseTemplate>
    <ScreeningsFilterComponent @update="fetchScreenings" />
    <ScreeningsTileComponent v-for="screening in screenings" :key="screening.id_screening" :screening="screening" />
    <Spacer />
  </BaseTemplate>
</template>

<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import ScreeningsFilterComponent from '../components/screenings/ScreeningsFilterComponent.vue'
  import ScreeningsTileComponent from '../components/screenings/ScreeningsTileComponent.vue'
  import Spacer from '../components/screenings/ScreeningsSpacerComponent.vue'
  import Navbar from '../components/Navbar.vue'
  import BaseTemplate from '../components/templates/BaseTemplate.vue'

  const screenings = ref([]);

  async function fetchScreenings(date, cinema) {
    try {
      const response = await axios.get(`/api/cinemas/${cinema}/halls/1/screenings?date=${date}`);
      screenings.value = response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania seansów:', error.message, error.response);
    }
  }
</script>