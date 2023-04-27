<template>
  <Navbar />
  <TheWelcome />
  <BaseTemplate>
    <News />
  </BaseTemplate>
</template>

<script setup>
  import TheWelcome from '../components/TheWelcome.vue'
  import Navbar from '../components/Navbar.vue'
  import BaseTemplate from '../components/templates/BaseTemplate.vue'
  import News from '../components/News.vue'
</script>
