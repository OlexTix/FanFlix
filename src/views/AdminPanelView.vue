<template>
    <main>
      <AdminPanelSideMenu/>
    </main>
</template>

<script>
import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"
import AdminPanelSideMenu from "../components/AdminPanelSideMenu.vue"
import Footer from "../components/Footer.vue"

export default defineComponent({
  name: 'AdminPanelView',
  components: {
    Navbar,
    Footer,
    AdminPanelSideMenu
}
})
</script>
