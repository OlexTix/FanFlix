<template>
  <main>
    <Navbar />
    <BaseTemplate>
      <Login />
    </BaseTemplate>
  </main>
  
</template>

<script>
import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"
import Login from "../components/Login.vue"
import BaseTemplate from "../components/templates/BaseTemplate.vue"

export default defineComponent({
  name: 'LoginView',
  components: {
    Navbar,
    BaseTemplate,
    Login,
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