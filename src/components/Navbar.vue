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
      <div class="buttons-sec">
        <RouterLink to="/login">Screenings</RouterLink>
        <RouterLink to="/login">Offers</RouterLink>
      </div>
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
  box-shadow: 0px 1px 8px 1px rgba(33, 33, 33, 1);
}
.navbar-one-header {
  margin-left: auto;
  margin-right: auto;
  max-width: 1024px;
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
  font-size: 1.15rem;
}
nav a {
  display: inline-flex;
  padding: 0 1rem;
  /* border-left: 1px solid var(--color-border); */
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: var(--color-background);
}
/* nav a:first-of-type {
  border: 0;
} */
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
  max-width: 1024px;
  padding: 0.3rem;

}
.buttons a {
  color: white;
  text-shadow: 1px 1px 6px rgba(64, 54, 54, 1);
  font-size: 1.2rem;
  font-family: Verdana, Tahoma, sans-serif;
}
.buttons-sec a {
  display: inline-flex;
  padding-right: 0.8rem;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
}
</style>