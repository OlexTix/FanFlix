<template>
  
  <div class="login">
    <!-- <h1>This is an login page</h1> -->
    
    <main>
      <!-- <Smile /> -->
      <Login />
    </main> 
    
  </div>
  
  
</template>

<script>
import Smile from '../components/Smile.vue'
import Login from '../components/Login.vue'
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutView',
  components: {
    Smile,
    Login,
  }
})
</script>

<style>
@media (min-width: 1024px) {
  .login {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
