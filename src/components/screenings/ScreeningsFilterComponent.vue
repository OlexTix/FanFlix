<template>
  <div class="rep-container">
    <Toast />
    <h2 class="rep-title">REPERTUAR</h2>
    <Dropdown v-model="selectedCinema" :options="cinemas" optionLabel="name" placeholder="Select a Cinema" class="rep-dropdown-custom" />
    <div class="rep-days-container">
      <header :class="{ 'rep-current-day': selectedDayIndex === 0 }" @click="onDayClick(0)">{{ getDateWithOffset(0) }}</header>
      <header v-for="(day, index) in days" :key="index" :class="{ 'rep-current-day': selectedDayIndex === index + 1 }" @click="onDayClick(index + 1)">{{ getDateWithOffset(index + 1) }}</header>
    </div>
    <h2 class="rep-date">{{ getDate() }}</h2>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown';

export default {
  components: {
    Dropdown,
  },
  data() {
    return {
      selectedCinema: null,
      selectedDate: null,
      cinemas: [],
      days: [],
      selectedDayIndex: null,
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
    this.updateSelectedDateData();
    this.emitSelectedData();
  },
  methods: {
    async fetchCinemas() {
      try {
        const response = await this.$http.get('/api/cinemas');
        this.cinemas = response.data;
        console.log('Otrzymane kina:', this.cinemas);
      } catch (error) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: `Błąd podczas pobierania kin.`, life: 3000 });
        console.error('Błąd podczas pobierania kin:', error.message, error.response);
      }
    },
    getCurrentDay() {
      const weekdays = ['Nd', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'So'];
      return weekdays[this.currentDayIndex];
    },
    getDate() {
      const date = new Date();
      date.setDate(date.getDate() + this.selectedDayIndex);
      const day = date.getDate();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${this.getWeekday(date.getDay())} ${day}.${month}.${year}`;
    },
    getDateWithOffset(offset) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      const weekdays = ['Nd', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'So'];
      return weekdays[date.getDay()];
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
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    onDayClick(dayIndex) {
      const selectedDate = new Date();
      this.selectedDayIndex = dayIndex;
      selectedDate.setDate(selectedDate.getDate() + dayIndex);
      this.selectedDate = this.formatDate(selectedDate);
      this.emitSelectedData();
      this.updateRouteWithDate(this.selectedDate);
      localStorage.setItem('selectedDateIndex', dayIndex);
    },
    emitSelectedData() {
      if (this.selectedCinema && this.selectedDate) {
        this.$emit('selected-data-changed', {
          cinema: this.selectedCinema.name,
          date: this.selectedDate,
        });
      }
    },
    updateSelectedDateData() {
      const newSelectedDateData = localStorage.getItem('selectedDateIndex') || null;

      console.log(newSelectedDateData);
      if(newSelectedDateData !== null) {
        this.onDayClick(Number(newSelectedDateData));
      }else{
        this.onDayClick(0);
        return;
      }
    },
    selectCinemaFromRoute() {
      const nazwaKina = this.$route.params.nazwaKina;
      const dateParam = this.$route.query.date;

      if (nazwaKina && nazwaKina !== 'select-cinema') {
        const foundCinema = this.cinemas.find(cinema => cinema.name === nazwaKina);
        if (foundCinema) {
          this.selectedCinema = foundCinema;
        } else {
          console.warn('Nie znaleziono kina o nazwie', nazwaKina);
          this.$toast.add({ severity: 'warn', summary: 'Warning', detail: `Nie znaleziono kina o nazwie ${nazwaKina}.`, life: 3000 });
          this.selectedCinema = null;
        }
        this.emitSelectedData();
      }

      if (dateParam) {
        const selectedDate = new Date(dateParam);
        this.selectedDate = this.formatDate(selectedDate);
        this.emitSelectedData();
      }
    },
    updateRoute() {
      if (this.selectedCinema && this.selectedDate) {
        this.$router.push({ 
          name: 'screenings', 
          params: { nazwaKina: this.selectedCinema.name },
          query: { date: this.selectedDate }
        });
      }
    },
    updateRouteWithDate(date) {
      if (this.selectedCinema) {
        this.$router.push({
          name: 'screenings',
          params: { nazwaKina: this.selectedCinema.name },
          query: { date }
        });
      }
    },
    updateLocalStorage(selectedCinema) {
      if (selectedCinema) {
        localStorage.setItem("selectedCinema", JSON.stringify(selectedCinema));
      } else {
        localStorage.removeItem('selectedCinema');
      }
    },
    updateOtherComponent() {
      this.emitter.emit('updateSelectedCinema');
    },
  },
  watch: {
    selectedCinema(newValue, oldValue) {
      console.log('Zmiana wybranego kina z', oldValue, 'na', newValue);
      this.emitSelectedData();
      this.updateRoute();
      this.updateLocalStorage(newValue);
      this.updateOtherComponent();
    },
    '$route.params.nazwaKina': {
    async handler(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (this.cinemas.length === 0) {
          await this.fetchCinemas();
        }
        this.selectCinemaFromRoute();
      }
    },
    immediate: true,
    },
  },
};
</script>
  
  <style scoped>
  .rep-dropdown-custom :deep(.p-dropdown-label) {
    padding: 6px;
  }
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

  header:hover {
    color: #01B25B;
    transition: color 0.2s ease-in-out;
    cursor: pointer;
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