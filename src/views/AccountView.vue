<template>
  
  <div class="login">
    <main>
      <Navbar />
      <Login />
    </main> 
    
  </div>
  
  
</template>

<script>
import { defineComponent } from 'vue'
import Login from '../components/Login.vue'
import Navbar from '../components/Navbar.vue'

export default defineComponent({
  name: 'AccountView',
  components: {
    Navbar,
    Login,
}
})
</script>

<style>

</style>
