<template>
  <Navbar />
  <main class="main-container">
    <div class="register-container">
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
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.register-container {
  flex-grow: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>