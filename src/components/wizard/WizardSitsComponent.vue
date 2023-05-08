<template>
    <div class="container">
      <h1 class="title">Wybierz siedzenia:</h1>
      <h2 class="subtitle">Wybierz miejsca na mapce poniżej.</h2>
  
      <div class="legend">
        <div class="legend-item" v-for="(status, index) in legendStatuses" :key="index">
          <div :class="['square', status.class]"></div>
          <span class="legend-label">{{ status.label }}</span>
        </div>
      </div>
  
      <img src="../../assets/wizard-screen.svg" class="graphic" />
  
      <div class="seats-grid">
        <div v-for="(row, rowIndex) in salaKinowa" :key="'row-' + rowIndex" class="row">
          <div
            v-for="(seat, seatIndex) in row"
            :key="'seat-' + rowIndex + '-' + seatIndex"
            class="seat-container"
            :class="seatClass(rowIndex, seatIndex)"
            @click="onSeatClick(rowIndex, seatIndex)"
          >
            <div v-if="seat !== 0" class="seat">
              <img :src="seatImage(rowIndex, seatIndex)" :alt="seatAltText(rowIndex, seatIndex)" />
            </div>
            <div v-if="seat !== 0" class="seat-number">{{ String.fromCharCode(65 + rowIndex) }}{{ seatIndex + 1 }}</div>
          </div>
        </div>
      </div>
  
      <div class="selected-seats">Wybrane miejsca: {{ selectedSeats.join(", ") }}</div>
      <Button 
        :class="{ 'confirm-seats-button-disabled': selectedSeats.length !== ticketsCount  }"
        class="confirm-seats-button" 
        @click="handleButtonClick">
        Potwierdź siedzenia
      </Button>
    </div>
  </template>
  
  <script>
  import Button from "primevue/button";
  import availableSeat from "../../assets/wizard-seat-available.svg";
  import unavailableSeat from "../../assets/wizard-seat-unavailable.svg";
  import selectedSeat from "../../assets/wizard-seat-selected.svg";
  
  export default {
    name: "SeatSelectionComponent",
    props: {
      hallID: {
        type: Number,
        required: true,
      },
      ticketsCount:{
        type: Number,
        required: true,
      }
  },
    components: {
      Button,
    },
    data() {
      return {
        selectedSeats: [],
        salaKinowa: null,
        legendStatuses: [
            { class: "legend-available", label: "Dostępne" },
            { class: "legend-unavailable", label: "Niedostępne" },
            { class: "legend-selected", label: "Twój wybór" },
      ],
    };
  },
  methods: {
    onSeatClick(rowIndex, seatIndex) {
      const seat = this.salaKinowa[rowIndex][seatIndex];
  
      if (seat === 2) {
          this.salaKinowa[rowIndex].splice(seatIndex, 1, 3);
      } else if (seat === 3) {
          this.salaKinowa[rowIndex].splice(seatIndex, 1, 2);
      }
  
      this.selectedSeats = this.getSelectedSeats();
    },
    seatImage(rowIndex, seatIndex) {
      const seat = this.salaKinowa[rowIndex][seatIndex];
      return [null, unavailableSeat, availableSeat, selectedSeat][seat];
    },
    seatAltText(rowIndex, seatIndex) {
      const seat = this.salaKinowa[rowIndex][seatIndex];
      return ["", "Niedostępne", "Dostępne", "Twój wybór"][seat];
    },
    seatClass(rowIndex, seatIndex) {
      const seat = this.salaKinowa[rowIndex][seatIndex];
      return ['', 'unavailable', 'available', 'selected'][seat];
    },
    getSelectedSeats() {
        const selectedSeats = [];

        this.salaKinowa.forEach((row, rowIndex) => {
        row.forEach((seat, seatIndex) => {
            if (seat === 3) {
            const seatLabel = `${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`;
            selectedSeats.push(seatLabel);
            }
        });
        });

        return selectedSeats;
    },
    handleButtonClick() {
        if (this.selectedSeats.length !== this.ticketsCount) {
            this.$toast.add({
            severity: 'info',
            summary: '',
            detail: 'Wybierz miejsca dla wszystkich kupionych biletów.',
            life: 3000,
            });
        } else {
            this.$emit('selected-seats', this.selectedSeats);
            console.log('Wybrane miejsca:', this.selectedSeats);
        }
    },
    async fetchCinemaHall() {
      const response = await this.$http.get(`/api/halls/layout?id_cinema_hall=${this.hallID}`);
      this.salaKinowa = response.data.cinemaHall;
      console.log('Otrzymana sala:', this.salaKinowa);
    },
  },
  mounted() {
    this.fetchCinemaHall();
  }
};
</script>
  
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.title,
.subtitle {
  font-weight: bold;
}

.title {
  font-size: 24px;
  padding-bottom: 40px;
}

.subtitle {
  font-size: 18px;
  padding-bottom: 20px;
}

.legend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 calc(5vw);
}

.legend-item {
  display: flex;
  align-items: center;
}

.square {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.legend-selected {
  background-color: #FFC700;
}

.legend-available {
  background-color: #018e55;
}

.legend-unavailable {
  background-color: #a1a1a1;
}

.legend-label {
  font-size: 16px;
  font-weight: normal;
}

.graphic {
  padding: 40px calc(5vw);
  width: 100%;
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
}

.selected-seats {
  padding-top: 50px;
  font-size: 18px;
  font-weight: bold;
}

.confirm-seats {
  margin: 20px auto;
}

.seats-grid {
  display: flex;
  flex-direction: column;
  padding: 0 calc(5vw);
}

.row {
  display: flex;
  justify-content: center;
}

.seat-container {
  position: relative;
  width: 5%;
  padding-top: 5%;
  margin: 1%;
}

.seat-container.available {
  cursor: pointer;
}

.seat-container.unavailable {
  cursor: default;
}

.seat {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.seat-number {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70%;
  font-weight: bold;
  color: #fff;
}

.confirm-seats-button {
  width: 250px;
  height: 40px;
  border-radius: 6px;
  background-image: linear-gradient(to bottom, #00a877, #007d59);
  border-color: #007d59;
  font-weight: 500;
  font-size: 18px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin: 20px 50px 150px auto;
  transition: all 0.3s ease;
}

.confirm-seats-button:hover {
  background-image: linear-gradient(to bottom, #008660, #005a41);
  border-color: #005f44;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.confirm-seats-button-disabled {
  background-image: linear-gradient(to bottom, #bbbbbb, #999999);
  border-color: #999999;
  cursor: not-allowed;
}

.confirm-seats-button-disabled:hover {
  background-image: linear-gradient(to bottom, #bbbbbb, #999999);
  border-color: #999999;
  box-shadow: none;
  transform: none;
}

@media (max-width: 500px) {
  .graphic {
    padding: 40px calc(5vw);
    width: 100%;
    filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
  }

  .seats-grid {
    display: flex;
    flex-direction: column;
    padding: 0;
  }
}
</style>