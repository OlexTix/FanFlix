<template>
  <div class="container">
    <div class="navbar-one-header">
      <div class="logo-image">
        <RouterLink to="/"><img src="/images/nfanflix3.svg" alt="Vue logo" class="logo"></RouterLink>
        <label class="switch">
          <input type="checkbox" v-model="isDarkMode" @change="toggleTheme" />
          <span class="slider"></span>
        </label>
      </div>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Strona główna</RouterLink>
          <RouterLink v-if="!loggedIn" to="/login">Zaloguj się</RouterLink>
          <RouterLink v-if="!loggedIn" to="/sign-up">Rejestracja</RouterLink>
          <RouterLink v-if="isAdmin" to="/admin-panel">Admin Panel</RouterLink>
          <a v-if="loggedIn" @click="logout" class="logout">Wyloguj</a>
        </nav>
      </div>
    </div>
    <div class="bottom-nav">
      <div class="buttons">
        <div class="buttons-sec" style="display: flex; align-items: center;">
          <RouterLink :to="screeningsLink">Repertuar</RouterLink>
          <NavbarLocationInfo />
        </div>
      </div>
    </div>
  </div>
  <RouterView />
</template>
<script>
import { RouterLink, RouterView } from 'vue-router';
import NavbarLocationInfo from './navbar/NavbarLocationInfo.vue';

export default {
  name: 'Navbar',
  components: {
    NavbarLocationInfo
  },
  data() {
    return {
      loggedIn: localStorage.getItem('accessToken'),
      isAdmin: null,
      isDarkMode: localStorage.getItem('theme') === 'dark',
    };
  },
  computed: {
    screeningsLink() {
      const selectedCinemaObj = JSON.parse(localStorage.getItem("selectedCinema"));
      if (selectedCinemaObj && selectedCinemaObj.name) {
        const selectedCinema = selectedCinemaObj.name;
        return `/cinemas/${selectedCinema}/screenings`;
      } else {
        return '/cinemas/select-cinema/screenings';
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      this.$toast.add({ severity: 'info', summary: 'Wylogowano pomyślnie :)', detail: "", life: 3000 });
      this.$router.push('/');
      this.loggedIn = null;
      this.isAdmin = null;
    },
    updateUserData() {
      this.loggedIn = localStorage.getItem('accessToken');
      const userDataJSON = localStorage.getItem('userData');
      const userData = userDataJSON ? JSON.parse(userDataJSON) : null;
      this.isAdmin = userData && userData.role === 'admin';
    },
    toggleTheme() {
      this.emitter.emit('toggleTheme', this.isDarkMode);
    },
  },
  mounted() {
    this.emitter.on('updateUserData', this.updateUserData);
    this.updateUserData();
  },
  beforeUnmount() {
    this.emitter.off('updateUserData', this.updateUserData);
  }
};
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

.logout {
  cursor: pointer;
}

.logo-image {
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;
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
  font-size: 1.05rem;
}

nav a {
  display: inline-flex;
  padding: 0 0.7rem;
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
  padding-left: 0.6rem !important;
  padding-right: 0.6rem !important;
  position: relative;
  top: 50%;
  transform: translateY(-50%);

}

.buttons a {
  color: white;
  text-shadow: 1px 1px 6px rgba(64, 54, 54, 1);
  font-size: 1.15rem;
  font-family: Verdana, Tahoma, sans-serif;
}

.buttons-sec a {
  display: inline-flex;
  padding-right: 0.8rem;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
}

.switch {
  position: relative;
  display: inline-flex;
  margin-left: 0.8rem;
  width: 3rem;
  height: 1.5rem;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #424242;
  transition: 0.4s;
  border-radius: 0.75rem;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1rem;
  width: 1rem;
  left: 0.27rem;
  bottom: 0.25rem;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #c9c9c9;
}

input:checked + .slider:before {
  transform: translateX(1.3rem);
  background-color: #141414;
}
</style>