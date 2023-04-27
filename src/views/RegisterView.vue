<template>
    <main>
      <Navbar/>
      <BaseTemplate>
        <Register />
      </BaseTemplate>
    </main>
</template>

<script>
import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"
import BaseTemplate from "../components/templates/BaseTemplate.vue"
import Register from "../components/Register.vue"

export default defineComponent({
  name: 'RegisterView',
  components: {
    Navbar,
    BaseTemplate,
    Register,
    }
})
</script>

<style>

</style>
