<template>
    <div class="rep-container">
      <h2 class="rep-title">REPERTUAR</h2>
      <Dropdown v-model="selectedCinema" :options="cinemas" optionLabel="name" placeholder="Select a Cinema" class="w-full md:w-14rem rep-dropdown-custom" />
      <div class="rep-days-container">
        <header class="rep-current-day">Dziś</header>
        <header class="rep-weekday">Wt</header>
        <header class="rep-weekday">Śr</header>
        <header class="rep-weekday">Cz</header>
        <header class="rep-weekday">Pt</header>
        <header class="rep-weekend">So</header>
        <header class="rep-weekend">Nd</header>
      </div>
      <h2 class="rep-date">Poniedziałek 27.03.2023</h2>
    </div>
  </template>
  
  <script>
  //import Datepicker from './Datepicker.vue';
  import axios from 'axios';
  import Dropdown from 'primevue/dropdown';
  
  export default {
  components: {
    Dropdown,
  },
  data() {
    return {
      selectedCity: null,
      cities: [],
      repertoire: [],
    };
  },
  async created() {
    await this.fetchCities();
    await this.fetchRepertoire();
  },
  methods: {
    async fetchCities() {
      try {
        const response = await axios.get('/api/cinemas');
        this.cities = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchRepertoire() {
      if (this.selectedCity) {
        try {
          const response = await axios.get(`/api/cinemas/${this.selectedCity}/repertoire`);
          this.repertoire = response.data;
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
  watch: {
    selectedCity() {
      this.fetchRepertoire();
    },
  },
};
</script>
  
  <style>
  .rep-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 25px 65px;
  }
  
  .rep-title {
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 20px;
    color: white;
  }
  
  .rep-days-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }
  
  header {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-right: 10px;
  }
  
  .rep-weekday {
    color: white;
  }
  
  .rep-weekend {
    color: #B0B0B0;
  }
  
  .rep-current-day {
    color: #01B25B;
  }
  
  .rep-date {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 100;
  }
  
  .rep-dropdown-custom {
    width: 250px;
    height: 40px;
    margin-bottom: 20px;
  }
  </style>