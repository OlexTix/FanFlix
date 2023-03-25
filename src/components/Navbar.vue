<template>
<div class="container">
  <div class="navbar-one-header">
    <div class="logo-image">
      <RouterLink to="/"><img src="/images/nfanflix3.svg" alt="Vue logo" class="logo"></RouterLink>
    </div>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/sign-up">Sign Up</RouterLink>
      </nav>
    </div>
  </div> 
  <div class="bottom-nav">
    <div class="buttons">
      <RouterLink to="/login">Screenings</RouterLink>
    </div>
  </div>
</div>
  <RouterView />
</template>
<script>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';

const checked = ref(true);
export default {
  name: 'Navbar',

  data: () => ({
    //
  }),
}
</script>

<style scoped>
.container {
  background-color: var(--color-background);
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-one-header {
  margin-left: auto;
  margin-right: auto;
  max-width: 1012px;
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between
}
.logo-image {
  margin: 0;
  padding: 0;
}
.logo-image img {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}
.logo {
  margin-top: 0.3rem;
  height: 3.8rem;
}
.wrapper nav a {
  align-items: center;
}
nav {
  font-size: 1.2rem;
  align-items: center;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
}
nav a {
  display: inline-flex;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}
nav a:first-of-type {
  border: 0;
}
.bottom-nav {
  
  background-color: rgba(0, 168, 119, 1);
  background-image: linear-gradient(180deg, rgba(0, 168, 119, 1) 0%, rgba(0, 125, 89, 1) 100%);
  width: 100%;
  height: 3.1rem;
  
}
.buttons {
  margin-left: auto;
  margin-right: auto;
  padding-left: 0.8rem !important;
  max-width: 1012px;
  padding: 0.3rem;

}
.buttons a {
  color: white;
  text-shadow: 1px 1px 6px rgba(64, 54, 54, 1);
  font-size: 1.2rem;
  font-family: Verdana, Tahoma, sans-serif;

}
</style>