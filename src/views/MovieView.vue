<template>
    <main>
      <Navbar/>
      <MoviePreview />
      <Footer/>
    </main>
</template>

<script>
import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"
import MoviePreview from "../components/MoviePreview.vue"
import Footer from "../components/Footer.vue"

export default defineComponent({
  name: 'MovieView',
  components: {
    Navbar,
    MoviePreview,
    Footer
    }
})
</script>
