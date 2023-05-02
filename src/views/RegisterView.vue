<template>
  <Navbar />
  <main class="main-container">
    <div class="login-container">
      <Register />
    </div>
    <Footer />
  </main>
</template>


<script>
import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"
import BaseTemplate from "../components/templates/BaseTemplate.vue"
import Register from "../components/Register.vue"
import Footer from '../components/Footer.vue'

export default defineComponent({
  name: 'RegisterView',
  components: {
    Navbar,
    BaseTemplate,
    Register,
    Footer,
  }
})
</script>

<style scoped>
.main-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
}

.login-container {
  flex-grow: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>