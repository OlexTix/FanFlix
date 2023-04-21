<template>
    <div class="other-item">
      <slot></slot> <!-- Dodaj slot, który pozwala wstawiać inne komponenty -->
      <Footer />
    </div>
  </template>
  
  <script setup>
  import Footer from '../components/Footer.vue'
  </script>
  
  <style>
  .other-item {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 1024px;
    background-color: var(--color-background-pres);
    display: flex;
    flex-direction: column;
  }
  .other-item p {
    padding: 2em;
  }
  </style>