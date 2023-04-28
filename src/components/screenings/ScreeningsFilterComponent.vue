<template>
  <div class="rep-container">
    <h2 class="rep-title">REPERTUAR</h2>
    <Dropdown v-model="selectedCinema" :options="cinemas" optionLabel="name" placeholder="Select a Cinema" class="w-full md:w-14rem rep-dropdown-custom" />
    <div class="rep-days-container">
      <header class="rep-current-day">{{ getCurrentDay() }}</header>
      <header class="rep-weekday" v-for="(day, index) in days">{{ day }}</header>
    </div>
    <h2 class="rep-date">{{ getDate() }}</h2>
  </div>
</template>

<script>
import axios from 'axios';
import Dropdown from 'primevue/dropdown';

export default {
  components: {
    Dropdown,
  },
  data() {
    return {
      selectedCinema: null,
      cinemas: [],
      days: [],
    };
  },
  computed: {
    currentDayIndex() {
      return new Date().getDay();
    },
  },
  async created() {
    this.days = this.buildDaysArray(this.currentDayIndex);
    await this.fetchCinemas();
    await this.fetchRepertoire();
  },
  methods: {
    async fetchCinemas() {
      try {
        const response = await axios.get('/api/cinemas');
        this.cinemas = response.data;
        console.log('Otrzymane kina:', this.cinemas);
      } catch (error) {
        console.error('Błąd podczas pobierania kin:', error.message, error.response);
      }
    },
    async fetchRepertoire() {
      if (this.selectedCinema) {
        try {
          const response = await axios.get(`/api/cinemas/${this.selectedCinema.name}/repertoire`);
          this.repertoire = response.data;
          console.log('Otrzymany repertuar:', this.repertoire);
        } catch (error) {
          console.error('Błąd podczas pobierania repertuaru:', error);
        }
      }
    },
    getCurrentDay() {
      const weekdays = ['Nd', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'So'];
      return weekdays[this.currentDayIndex];
    },
    getDate() {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${this.getWeekday(date.getDay())} ${day}.${month}.${year}`;
    },
    buildDaysArray(currentDayIndex) {
      const days = ['Nd','Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'So'];
      const orderedDays = [];
      for (let i = currentDayIndex + 1; orderedDays.length < 7; i++) {
        orderedDays.push(days[i % 7]);
      }
      return orderedDays;
    },
    getWeekday(day) {
      const weekdays = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek','Piątek', 'Sobota'];
      return weekdays[day];
    },
  },
  watch: {
    selectedCinema(newValue, oldValue) {
      console.log('Zmiana wybranego kina z', oldValue, 'na', newValue);
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
    padding: 25px 0px;
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