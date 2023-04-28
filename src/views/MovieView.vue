<template>
  <main>
    <Navbar />
    <BaseTemplate>
      <MoviePreview />
    </BaseTemplate>
  </main>
</template>

<script>
import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"
import MoviePreview from "../components/MoviePreview.vue"
import BaseTemplate from "../components/templates/BaseTemplate.vue"

export default defineComponent({
  name: 'MovieView',
  components: {
    Navbar,
    MoviePreview,
    BaseTemplate
  }
})
</script>
