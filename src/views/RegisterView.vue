<template>
    <main>
      <Navbar/>
      <Register />
    </main>
</template>

<script>
import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"
import Register from "../components/Register.vue"

export default defineComponent({
  name: 'RegisterView',
  components: {
    Navbar,
    Register,
    }
})
</script>
