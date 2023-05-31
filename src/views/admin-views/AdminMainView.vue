<template>
  <AdminPanelTemplate>
    <p class="title-dashboard">Panel Główny</p>
    <div class="box-bar">
      <div class="bar-status">
        <span class="tile-text-top">Sprzedane bilety</span><br>
        <img src="../../assets/ticket.svg" alt="Ikona 1" class="tile-icon">
        <span class="tile-number" ref="soldTickets">{{ soldTickets }}</span>
      </div>
      <div class="bar-status">
        <span class="tile-text-top">Liczba seansów</span><br>
        <img src="../../assets/screening.svg" alt="Ikona 2" class="tile-icon">
        <span class="tile-number" ref="numberOfScreenings">{{ numberOfScreenings }}</span>
      </div>
      <div class="bar-status">
        <span class="tile-text-top">Liczba filmów</span><br>
        <img src="../../assets/admin-assets/movies.svg" alt="Ikona 3" class="tile-icon">
        <span class="tile-number" ref="numberOfMovies">{{ numberOfMovies }}</span>
      </div>
    </div>
  </AdminPanelTemplate>
</template>

<script>
import AdminPanelTemplate from '../../components/templates/AdminPanelTemplate.vue';
import axiosInstance from '../../service/apiService';

export default {
  components: {
    AdminPanelTemplate
  },
  data() {
    return {
      soldTickets: 1034,
      numberOfScreenings: 0,
      numberOfMovies: 0
    };
  },
  async created() {
    try {
      const screeningsResponse = await axiosInstance.get('/api/panel/screenings');
      this.screenings = screeningsResponse.data;
      this.numberOfScreenings = this.screenings.length;

      const moviesResponse = await axiosInstance.get('/api/panel/movies');
      this.movies = moviesResponse.data;
      this.numberOfMovies = this.movies.length;

      this.animateNumber('soldTickets', this.soldTickets);
      this.animateNumber('numberOfScreenings', this.numberOfScreenings);
      this.animateNumber('numberOfMovies', this.numberOfMovies);
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    animateNumber(refName, value) {
      const el = this.$refs[refName];
      const startValue = 0;
      const endValue = value;
      const duration = 1000; // Adjust the duration as needed
      const range = endValue - startValue;
      const increment = range / (duration / 16); // Update the number every 16ms (similar to 60fps)

      let current = startValue;

      const updateNumber = () => {
        if (current < endValue) {
          current += increment;
          el.textContent = Math.round(current);
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = endValue;
        }
      };

      updateNumber();
    }
  }
}
</script>


<style>
.title-dashboard {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.box-bar {
  display: flex;
  justify-content: flex-start;
  gap: 1.2rem;
}

.bar-status {
  flex: 1;
  max-width: 17.5rem;
  height: 7rem;
  background-color: var(--color-background);
  border-radius: .6rem;
  /* display: flex; */
  align-items: center;
  padding: .6rem;
  position: relative;
}

.tile-text-top {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: auto;
}

.tile-icon {
  height: 2rem;
  margin-right: 0.5rem;
  filter: var(--color-logo);
}

.tile-number {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 1.3rem;
}

@media screen and (max-width: 892px) {
  .box-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .bar-status {
    flex: 1;
    max-width: 16rem;
    height: 6rem;
    background-color: var(--color-background);
    border-radius: 10px;
  }
}

.tile-number {
  /* ... */
  transition: 0.5s; /* Add a smooth transition effect */
}

</style>