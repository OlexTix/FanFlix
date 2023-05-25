<template>
    <div class="container">
      <div class="title">Wybierz bilety:</div>

      <div class="tickets-container">
        <div v-if="ticketsModel" v-for="(ticket, index) in ticketsModel" :key="index" class="ticket-row">
          <div class="ticket-label ticket-column">{{ ticket.title }}</div>
          <div class="ticket-price ticket-column">{{ formatPrice(ticket.price) }} zł</div>
          <img src="../../assets/minus-icon.svg" class="icon ticket-column" @click="decrementTicketQuantity(ticket.id_ticket_type)" />
          <div class="ticket-count ticket-column">{{ getTicketQuantity(ticket.id_ticket_type) }}</div>
          <img src="../../assets/plus-icon.svg" class="icon ticket-column" @click="incrementTicketQuantity(ticket.id_ticket_type)" />
        </div>
      </div>

      <Divider/>
  
      <div class="summary-row">
        <div class="summary-label">Suma</div>
        <div class="summary-total">{{ formatPrice(totalPrice) }} zł</div>
      </div>
  
      <div class="discount-info">
        Zaoszczędź 3.33% z kartą Moja Biedronka i Kaufland Card!
      </div>
  
      <div class="logos">
        <img src="../../assets/payments/card-biedronka.png" class="card" />
        <img src="../../assets/payments/card-kaufland.png" class="card" />
      </div>
  
      <Button 
        :class="{ 'next-button-disabled': totalPrice === 0 }"
        class="next-button" 
        @click="handleButtonClick">
          Dalej
      </Button>
    </div>
  </template>
  
  <script>
  import Divider from '../Divider.vue';
  import Button from 'primevue/button';
  export default {
    name: "WizardTicketComponent",
    data() {
      return {
        ticketsModel: null,
        isLoading: true,
        selectedScreeningData: {
          tickets: [],
        },
      };
    },
    components: {
      Divider,
      Button
    },
    computed: {
      totalPrice() {
        if (this.selectedScreeningData.tickets) {
          return this.selectedScreeningData.tickets.reduce((total, ticket) => {
            const ticketModel = this.ticketsModel.find((t) => t.id_ticket_type === ticket.id);
            return total + (ticketModel ? ticketModel.price : 0) * ticket.quantity;
          }, 0);
        }
        return 0;
      },
    },
    methods: {
      incrementTicketQuantity(id) {
        let ticket = this.selectedScreeningData.tickets.find((ticket) => ticket.id === id);
        if (ticket) {
          ticket.quantity++;
        } else {
          this.selectedScreeningData.tickets.push({
            id,
            quantity: 1,
          });
          ticket = this.selectedScreeningData.tickets.find((ticket) => ticket.id === id);
        }
        this.updateSelectedScreeningData({
          tickets: this.selectedScreeningData.tickets,
          seats: undefined
        });
      },
      decrementTicketQuantity(id) {
        const ticket = this.selectedScreeningData.tickets.find((ticket) => ticket.id === id);
        if (ticket && ticket.quantity > 0) {
          ticket.quantity--;
          if (ticket.quantity === 0) {
            const index = this.selectedScreeningData.tickets.findIndex((ticket) => ticket.id === id);
            this.selectedScreeningData.tickets.splice(index, 1);
          }
          this.updateSelectedScreeningData({
            tickets: this.selectedScreeningData.tickets,
            seats: undefined
          });
        }
      },
      formatPrice(value) {
        return (Number(value) / 100).toFixed(2);
      },
      updateSelectedScreeningData(newData) {
        this.selectedScreeningData = JSON.parse(localStorage.getItem('selectedScreeningData')) || {};
        const newSelectedScreeningData = {
          ...this.selectedScreeningData,
          ...newData
        };

        if (newSelectedScreeningData.seats === undefined) {
          delete newSelectedScreeningData.seats;
        }

        const newSelectedScreeningDataJSON = JSON.stringify(newSelectedScreeningData);
        localStorage.setItem('selectedScreeningData', newSelectedScreeningDataJSON);
        this.selectedScreeningData = newSelectedScreeningData;
      },
      handleButtonClick() {
        if (this.totalPrice === 0) {
          this.$toast.add({
            severity: 'info',
            summary: '',
            detail: 'Wybierz przynajmniej jeden bilet, aby kontynuować.',
            life: 3000,
          });
        } else {
          console.log('Wybrane bilety:', this.selectedScreeningData.tickets);
          this.updateSelectedScreeningData({
            step: 2
          })
          this.$router.push('/wizard/seats');
        }
      },
      getTicketQuantity(id) {
        const ticket = this.selectedScreeningData.tickets.find((ticket) => ticket.id === id);
        return ticket ? ticket.quantity : 0;
      },
      async fetchTicketsData() {
        try {
          const response = await this.$http.get(`/api/ticketTypes`);
          this.ticketsModel = response.data;
        } catch (error) {
          console.error('Nie udało się pobrać danych o biletach:', error);
          return;
        }

        try {
          this.selectedScreeningData = JSON.parse(localStorage.getItem('selectedScreeningData')) || { tickets: [] };
        } catch (error) {
          console.warn('Nie udało się przetworzyć danych z localStorage:', error);
          return;
        }

        try {
          this.selectedScreeningData.tickets = this.ticketsModel.map((ticket) => {
            const matchingTicket = this.selectedScreeningData.tickets ?
              this.selectedScreeningData.tickets.find(t => t.id === ticket.id_ticket_type) : null;

            return {
              id: ticket.id_ticket_type,
              quantity: matchingTicket ? matchingTicket.quantity : 0,
            };
          });

          console.log('Otrzymana lista biletów:', this.selectedScreeningData.tickets);
        } catch (error) {
          console.error('Nie udało się przetworzyć modelu biletów:', error);
        }
      },
    },
    mounted(){
      this.fetchTicketsData();
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    padding-bottom: 40px;
  }
  
  .ticket-row,
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .summary-label{
    margin-left: 30px;
  }

  .summary-total{
    margin-right: 50px;
  }

  .tickets-container {
    padding: 0px 30px;
  }
  
  .ticket-row {
    display: grid;
    grid-template-columns: 5fr 3fr auto 2fr auto;
    align-items: center;
    margin-bottom: 50px;
  }

  .ticket-column {
    flex: 1;
    text-align: center;
  }
  
  .ticket-label,
  .ticket-price {
    font-size: 19px;
  }
  
  .ticket-label {
    text-align: left;
    font-weight: bold;
  }
  
  .icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
    filter: var(--color-logo);
  }
  
  .ticket-count {
    font-size: 20px;
    font-weight: bold;
    margin: 0 10px;
  }

.summary-row {
  font-size: 24px;
  font-weight:800;
  margin-bottom: 20px;
}

.discount-info {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-left: 35px;
}

.logos {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  margin-left: 50px;
}

.card {
  height: 80px;
  margin-right: 20px;
  border-radius: 7px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.next-button {
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

.next-button:hover {
  background-image: linear-gradient(to bottom, #008660, #005a41);
  border-color: #005f44;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.next-button-disabled {
  background-image: linear-gradient(to bottom, #bbbbbb, #999999);
  border-color: #999999;
  cursor: not-allowed;
}

.next-button-disabled:hover {
  background-image: linear-gradient(to bottom, #bbbbbb, #999999);
  border-color: #999999;
  box-shadow: none;
  transform: none;
}


</style>