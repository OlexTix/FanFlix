<template>
  <main>
    <Navbar />
    <OtherItem>
      <Login />
    </OtherItem>
  </main>
  
</template>

<script>
import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"
import Login from "../components/Login.vue"
import OtherItem from "../components/OtherItem.vue"

export default defineComponent({
  name: 'LoginView',
  components: {
    Navbar,
    OtherItem,
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