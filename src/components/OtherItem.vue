<template>
    <div class="con">
        <p>Example component</p>
        <Footer />
    </div>
</template>

<script setup>
import Footer from '../components/Footer.vue'
</script>

<style>
.con {
  margin-left: auto;
  margin-right: auto;
  max-width: 1024px;
  
  background-color: var(--color-background-pres);
  display: flex;
  flex-direction: column;
}
.con p {
    padding: 2em;
}
</style>