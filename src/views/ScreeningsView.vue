<template>
  <Navbar />
  <BaseTemplate>
    <ScreeningsFilterComponent />
    <ScreeningsTileComponent />
    <Spacer />
    <ScreeningsTileComponent />
    <Spacer />
  </BaseTemplate>
</template>

<script setup>
  import ScreeningsFilterComponent from '../components/screenings/ScreeningsFilterComponent.vue'
  import ScreeningsTileComponent from '../components/screenings/ScreeningsTileComponent.vue'
  import Spacer from '../components/screenings/ScreeningsSpacerComponent.vue'
  import Navbar from '../components/Navbar.vue'
  import BaseTemplate from '../components/templates/BaseTemplate.vue'
</script>