<template>
    <div class="other-item">
      <slot></slot> <!-- Allows you to insert other components -->
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
  </style>