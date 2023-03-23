<template>
  <Navbar/>
<div class="row">
    <div class="column">
        <Login />
    </div>
    <div class="column">
      <Register/>
    </div>
</div> 
   
  
  
</template>

<script>
import { defineComponent } from 'vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Navbar from '../components/Navbar.vue'
import Button from 'primevue/button';

export default defineComponent({
  name: 'AccountView',
  components: {
    Navbar,
    Login,
    Register,
}
})
</script>

<style>


.column {
  float: left;
  width: 50%;
  padding: 20px;
  height: 350px; 
}

</style>