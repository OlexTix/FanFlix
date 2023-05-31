<template>
	<header class="main-header">
		<nav>
			<button class="main-header-sidebar-toggle">
				<div id="toggle-icon-menu">
					<img src="../../assets/admin-assets/hamburger.svg" alt="Hamburger" class="logo">
				</div>
				<div id="toggle-icon-close">
					<img src="../../assets/admin-assets/icon_close.svg" alt="Close" class="logo">
				</div>
			</button>

			<ul>
				<li class="main-header-logo">
					<a href="index.html">
						<RouterLink to="/admin-panel"><img src="/images/nfanflix3.svg" alt="Vue logo" class="logo"></RouterLink>
					</a>
				</li>
				<li>
					<RouterLink to="/">
						<img src="../../assets/admin-assets/house.svg" alt="House" class="logo">
						<span>Wyjdź</span>
					</RouterLink>
				</li>
				<li class="main-top-dashboard">
					<RouterLink to="/admin-panel">
						<img src="../../assets/admin-assets/dashboard.svg" alt="Dashboard" class="logo">
						<span>Panel główny</span>
					</RouterLink>
				</li>
        		<li>
					<RouterLink to="/admin-panel/cinemas">
						<img src="../../assets/admin-assets/cinemas.svg" alt="Cinemas" class="logo">
						<span>Kina</span>
					</RouterLink>
				</li>
				

			</ul>
			<div class="info-admin-account">
				<a href="#">
					<span>Admin</span>
					<img src="../../assets/admin-assets/user_account.svg" alt="User" class="logo">
				</a>
				<a href="#" @click="logout">
					<span>Wyloguj się</span>
					<img src="../../assets/admin-assets/logout.svg" alt="Logout" class="logo">
				</a>
			</div>
			
		</nav>
	</header> 

	<section class="main">
		<div class="overlay"></div>

		<div class="sidebar">
			<!-- <button class="sidebar-collapse">
				<img src="../../assets/admin-assets/icon_collapse.svg" alt="Collapse" class="logo">
				<span>Zwiń menu</span>
			</button> -->

			<nav class="sidebar-nav">
				<ul>
					<li class="menu-heading"><span>Zarządzaj</span></li>
					<li>
						<RouterLink to="/admin-panel">
							<img src="../../assets/admin-assets/dashboard.svg" alt="Dashboard" class="logo">
							<span>Panel Główny</span>
						</RouterLink>
					</li>
					<li>
						<RouterLink to="/admin-panel/cinemas">
							<img src="../../assets/admin-assets/cinemas.svg" alt="Cinemas" class="logo">
							<span>Kina</span>
						</RouterLink>
					</li>
					<li>
						<RouterLink to="/admin-panel/screenings">
							<img src="../../assets/admin-assets/cinemas.svg" alt="Screenings" class="logo">
							<span>Repertuar</span>
						</RouterLink>
					</li>
					<li>
						<RouterLink to="/admin-panel/movies">
							<img src="../../assets/admin-assets/movies.svg" alt="Movies" class="logo">
							<span>Filmy</span>
						</RouterLink>
					</li>
					  <li>
						<RouterLink to="/admin-panel/users">
							<img src="../../assets/admin-assets/users.svg" alt="Userss" class="logo">
							<span>Użytkownicy</span>
						</RouterLink>
					</li>					
					<!-- <li>
						<RouterLink to="/admin-panel/settings">
							<img src="../../assets/admin-assets/settings.svg" alt="Settings" class="logo">
							<span>Ustawienia</span>
						</RouterLink>
					</li> -->
					<li class="menu-heading"><span>Motyw</span></li>
					<li>
						<!-- <div class="sidebar-theme-switcher">
							<div id="sidebar__theme-switcher__sun">
								<img src="../../assets/admin-assets/sun.svg" alt="Sun" class="logo">
							</div>
			
							<div id="sidebar__theme-switcher__moon">
								<img src="../../assets/admin-assets/moon.svg" alt="Moon" class="logo">
							</div>
						</div> -->
						<label class="switch">
				          <input type="checkbox" v-model="isDarkMode" @change="toggleTheme" />
				          <span class="slider"></span>
				        </label>
					</li>
				</ul>
			</nav>
		</div>
			
		<div class="main-content">
			<Breadcrumb class="main-breadcrumb" :home="home" :model="breadcrumbs" />
			<slot class="main-content-container"></slot>
		</div> 
	</section> 
</template>

<script>
import Breadcrumb from 'primevue/breadcrumb';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'AdminPanelTemplate',
  components: {
		Breadcrumb
	},
  data() {
    return {
		isDarkMode: localStorage.getItem('theme') === 'dark',
      	userCount: 0,
      	totalVisits: 0,
      	employeeCount: 0,
	  	loggedIn: localStorage.getItem('accessToken'),
      	isAdmin: true,
	  	home: {
			icon: 'pi pi-home',
			to: '/',
		},
        breadcrumbs: [],
    };
  },
  setup() {
    const route = useRoute();

	// Mapowanie ścieżek na odpowiednie nazwy
    const pathNames = {
      "admin-panel": "Panel Admina",
      "screenings": "Repertuar",
	  "cinemas": "Kina",
	  "add": "Dodaj nowy"
    };

    // Oblicza breadcrumbs na podstawie ścieżki
    const breadcrumbs = computed(() => {
      const pathArray = route.path.split("/");
      pathArray.shift();

      let breadcrumbs = pathArray.map((path, i) => {
        return { label: pathNames[path] || path, to: '/' + pathArray.slice(0, i + 1).join('/') };
      });

      return breadcrumbs;
    });

    // Obserwuje zmiany w ścieżce i aktualizuje breadcrumbs
    watch(() => route.path, () => {
      this.breadcrumbs = breadcrumbs.value;
    });

    return { breadcrumbs };
  },
  methods: {
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      this.$toast.add({ severity: 'info', summary: 'Wylogowano pomyślnie', detail: "", life: 3000 });
      this.$router.push('/');
      this.loggedIn = null;
      this.isAdmin = null;
    },
	toggleTheme() {
      this.emitter.emit('toggleTheme', this.isDarkMode);
    },
  },
};
</script>

<style scoped>
.main-header {
	background-color: var(--main-header-bg);
	padding: 1rem 1.5rem;
	transition: background-color .4s ease-in-out;
}

.main-header nav,
.main-header ul,
.main-header a {
	display: flex;
	align-items: center;
}

.main-header nav {
	justify-content: space-between;
}

.main-header nav ul {
	list-style: none;
	margin: 0;
	padding: 0;
	gap: 2rem;
}

.main-header img {
	fill: var(--color-heading);
	transition: fill .4s ease-in-out;
}

.main-header-sidebar-toggle {
	appearance: none;
	background-color: transparent;
	border: none;
}

#toggle-icon-close,
body.sidebar-open #toggle-icon-menu {
	display: none;
}

body.sidebar-open #toggle-icon-close {
	display: block;
}


.main-header-logo,
.main-header a span {
	display: none;
}

.main {
	position: relative;
	min-height: calc(100vh - 64px);
	display: flex;
	flex-direction: column;
}

.info-admin-account {
	display: flex;
	gap: 1.5rem;
}
.sidebar {
	background-color: var(--color-background);
	padding: 1.5rem 0 1.5rem 1.5rem;
	position: absolute;
	top: 0;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	min-height: 100%;
	align-items: flex-start;
	transform: translate3d(-100%, 0, 0);
	transition: transform .4s ease-in-out, background-color .4s ease-in-out;
}

.sidebar img {
	width: 1.25rem;
	height: 1.25rem;
	fill: var(--color-heading);
	transition: fill .4s ease-in-out;
}

.sidebar-collapse {
	display: none;
}

.sidebar-nav ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.sidebar-nav ul a {
	display: flex;
	padding: .75rem 0;
	gap: .75rem;
	align-items: center;
	text-decoration: none;
	color: var(--sidebar-link-color);
	padding-right: 3rem;
	transition: color .3s ease-in-out;
}

.sidebar-nav ul a.active {
	color: var(--sidebar-link-active-color);
}

.sidebar-nav ul a.active img {
	fill: var(--sidebar-icon-active-fill);
}

.sidebar-nav ul a:hover {
	color: var(--sidebar-link-active-color);
}

.sidebar-nav ul a:hover img {
	fill: var(--sidebar-icon-active-fill);
}

.menu-heading {
	color: var(--sidebar-menu-heading-color);
	font-size: 81.25%;
	text-transform: uppercase;
	font-weight: 700;
	letter-spacing: 1px;
	padding: .75rem 0;
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

.overlay {
	position: absolute;
	inset: 0;
	background-color: var(--gray-alpha-80);
	opacity: 0;
	transition: opacity .4s ease-in-out, visibility .4s ease-in-out;
	overflow: hidden;
	visibility: hidden;
}

body.sidebar-open #overlay {
	opacity: 1;
	visibility: visible;
}

body.sidebar-open #sidebar {
	transform: translate3d(0, 0, 0);
}

.main-content {
  background-color: var(--color-background-pres);
	padding: 1.5rem;
	flex-grow: 1;
}

.main-content-container {
	border: var(--gray-tint-50) 1px dashed;
	border-radius: 8px;
}

.main-breadcrumb {
	margin-bottom: 1.5rem;
}

@media screen and (min-width: 768px) {
	.main-header-sidebar-toggle {
		display: none;
	}

	.main-header-logo {
		display: block;
		margin-right: 1.5rem;
	}

	.main-header-logo a img {
		height: 2rem;
	}

	.main-header a {
		text-decoration: none;
	}

	.main-header a span {
		display: inline-block;
		font-size: 0.85rem;
		color: var(--color-heading);
		transition: color .4s ease-in-out;
	}

	.main-header nav ul {
		gap: 1.3rem;
	}

	.main-header a {
		gap: .5rem;
	}

	.main-top-dashboard {
		display: none;
	}

	.sidebar {
		position: relative;
		transform: none;
	}

	.main {
		display: grid;
		grid-template-columns: auto 1fr;
	}

	.sidebar-collapse {
		display: flex;
		align-items: center;
		gap: .75rem;
		padding: .75rem 0;
		appearance: none;
		background: transparent;
		border: none;
		font-size: 81.25%;
		color: var(--primary-base);
		cursor: pointer;
	}

	.sidebar-collapse img {
		fill: var(--primary-base);
	}

	body.sidebar-collapsed .menu-heading,
	body.sidebar-collapsed .sidebar span {
		display: none;
	}

	body.sidebar-collapsed #sidebar__theme-switcher {
		display: none;
	}

	body.sidebar-collapsed .sidebar {
		padding-right: 1.5rem;
	}

	body.sidebar-collapsed .sidebar a,
	body.sidebar-collapsed .sidebar-collapse {
		width: 2.75rem;
		padding-right: 0;
		justify-content: center;
	}

	body.sidebar-collapsed .sidebar-collapse img {
		transform: rotate(180deg);
	}
}
</style>
