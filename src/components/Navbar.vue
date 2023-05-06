<template>
  <div class="container">
    <div class="navbar-one-header">
      <div class="logo-image">
        <RouterLink to="/"><img src="/images/nfanflix3.svg" alt="Vue logo" class="logo"></RouterLink>
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
          <RouterLink to="/login">Oferty</RouterLink>
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
      isAdmin: null
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
    }
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
</style>