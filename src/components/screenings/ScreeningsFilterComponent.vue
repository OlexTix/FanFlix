<template>
  <div class="rep-container">
    <Toast />
    <h2 class="rep-title">REPERTUAR</h2>
    <Dropdown v-model="selectedCinema" :options="cinemas" optionLabel="name" placeholder="Select a Cinema" class="w-full md:w-14rem rep-dropdown-custom" />
    <div class="rep-days-container">
      <header class="rep-current-day" @click="onDayClick(0)">{{ getCurrentDay() }}</header>
      <header class="rep-weekday" v-for="(day, index) in days" @click="onDayClick(index+1)">{{ day }}</header>
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
    };
  },
  computed: {
    currentDayIndex() {
      return new Date().getDay();
    },
  },
  async created() {
    this.days = this.buildDaysArray(this.currentDayIndex);
    this.fetchCinemas();
    this.onDayClick(0);
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
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    onDayClick(dayIndex) {
      const selectedDate = new Date();
      selectedDate.setDate(selectedDate.getDate() + dayIndex);
      this.selectedDate = this.formatDate(selectedDate);
      this.emitSelectedData();
    },
    emitSelectedData() {
      if (this.selectedCinema && this.selectedDate) {
        this.$emit('selected-data-changed', {
          cinema: this.selectedCinema.name,
          date: this.selectedDate,
        });
      }
    },
    showToast(severity, summary, detail) {
      this.toast.add({
        severity,
        summary,
        detail,
        life: 3000,
      });
    },
  },
  watch: {
    selectedCinema(newValue, oldValue) {
      console.log('Zmiana wybranego kina z', oldValue, 'na', newValue);
      this.emitSelectedData();
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