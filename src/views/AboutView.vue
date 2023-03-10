<template>
  
  <div class="about">
    <h1>This is an about page</h1>
    
      
    
  </div>
  <main><Smile /></main>
</template>

<script>
import Smile from '../components/Smile.vue'
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutView',
  components: {
    Smile,
  }
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
