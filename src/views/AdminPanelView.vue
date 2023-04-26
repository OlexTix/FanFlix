<template>
    <main>
      <AdminPanelSideMenu/>
    </main>
</template>

<script>
import { defineComponent } from "vue"
import AdminPanelSideMenu from "../components/AdminPanelSideMenu.vue"

export default defineComponent({
  name: 'AdminPanelView',
  components: {
    AdminPanelSideMenu
}
})
</script>
