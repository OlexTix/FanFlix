<template>
  <Navbar />
  <OtherItem>
    <RepertoireComponent />
    <!-- kolejne komponenty, które będą się stakować wertykalnie -->
  </OtherItem>
</template>

<script setup>
import RepertoireComponent from '../components/RepertoireComponent.vue'
import Navbar from '../components/Navbar.vue'
import OtherItem from '../components/OtherItem.vue'
</script>