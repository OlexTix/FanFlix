<template>
    <main>
      <Navbar/>
      <OtherItem>
        <Register />
      </OtherItem>
    </main>
</template>

<script>
import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"
import OtherItem from "../components/OtherItem.vue"
import Register from "../components/Register.vue"

export default defineComponent({
  name: 'RegisterView',
  components: {
    Navbar,
    OtherItem,
    Register,
    }
})
</script>

<style>

</style>
