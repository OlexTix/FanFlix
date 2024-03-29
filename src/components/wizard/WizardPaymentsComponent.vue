<template>
  <div class="container">
    <h2 class="summary-title">Podsumowanie:</h2>

    <div 
      v-if="selectedScreeningData" 
      v-for="(ticket, index) in selectedScreeningData.tickets" 
      :key="index" 
      class="summary-line"
      v-show="ticket.quantity > 0">
      <p class="summary-item">{{ getTicketTitle(ticket.id) }} x {{ ticket.quantity }}</p>
      <p class="summary-item summary-price">{{ ((getTicketPrice(ticket.id) * ticket.quantity) / 100).toFixed(2) }}zł</p>
    </div>

    <Divider />

    <div class="summary-row">
      <div class="summary-label">Suma</div>
      <div v-if="selectedScreeningData" class="summary-total">{{ formatPrice(totalPrice()) }} zł</div>
    </div>

    <p class="confirmation-text">
      Zostaniesz przekierowany na stronę płatnosci. Po zapłacaniu na podany e-mail zostanie wysłany numer biletu, który należy podać w kasie kina.
    </p>

    <div class="acceptance">
      <Checkbox  v-model="accepted" :binary="true" />
      <label for="acceptance" class="acceptance-text">*Akceptuję Regulamin i Politykę prywatności.</label>
    </div>

    <Button 
        :class="{ 'confirm-payment-button-disabled': accepted !== true  }"
        class="confirm-payment-button" 
        @click="handleButtonClick">
        Zapłać
      </Button>
  </div>
</template>
  
  <script>
  import Checkbox from 'primevue/checkbox';
  import Button from "primevue/button";
  import Divider from '../../components/Divider.vue';
  
  export default {
    name: 'OrderSummaryComponent',
    components: {
      Divider,
      Button,
      Checkbox
    },
    data() {
      return {
        selectedScreeningData: null,
        ticketsModel: null,
        accepted: false,
        isLoading: false
      };
    },
    methods: {
      totalPrice() {
        return this.selectedScreeningData.tickets.reduce((sum, ticket) => sum + this.getTicketPrice(ticket.id) * ticket.quantity, 0);
      },
      getTicketTitle(id) {
        return this.ticketsModel?.find(ticket => ticket.id_ticket_type === id)?.title ?? '';
      },
      getTicketPrice(id) {
        return this.ticketsModel?.find(ticket => ticket.id_ticket_type === id)?.price ?? 0;
      },
      formatPrice(price) {
        return (price / 100).toFixed(2);
      },
      async redirectToStripe(ticketArray) {
        var ticketData = ticketArray.map(ticket => {
          return {
            id: ticket.id,
            quantity: ticket.quantity
          };
        });
        ticketData = encodeURIComponent(JSON.stringify(ticketData));
        const response = await this.$http.post(`/api/checkout?ticketData=${ticketData}`);
        window.location.href = response.data.url;
      },
      async handleButtonClick() {
        if (this.accepted !== true) {
            this.$toast.add({
            severity: 'info',
            summary: '',
            detail: 'Zaakceptuj regulamin i politykę prywatności',
            life: 3000,
            });
        } else {
          console.log('kutateladze',this.selectedScreeningData.tickets.filter(ticket => ticket.quantity > 0));
          await this.redirectToStripe(this.selectedScreeningData.tickets.filter(ticket => ticket.quantity > 0));
          console.log('Wybrane miejsca:', this.selectedSeats);
        }
      },
      updateSelectedScreeningData(newData) {
        this.selectedScreeningData = JSON.parse(localStorage.getItem('selectedScreeningData')) || {};
        const newSelectedScreeningData = {
            ...this.selectedScreeningData,
            ...newData
        };
        const newSelectedScreeningDataJSON = JSON.stringify(newSelectedScreeningData);
        localStorage.setItem('selectedScreeningData', newSelectedScreeningDataJSON);
        this.selectedScreeningData = newSelectedScreeningData;
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
    mounted() {
      this.updateSelectedScreeningData();
      this.fetchTicketsData();
      console.log("wybrane bilety:",this.selectedScreeningData.tickets);
    },
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .summary-title,
  .payment-methods-title,
  .confirmation-title {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 30px;
  }
  
  .summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
    padding: 0 30px;
  }
  
  .payment-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-gap: 10px;
    height: 120px;
    border-radius: 10px;
    overflow-wrap: break-word;
  }

  .payments-card {
    height: 80px;
    margin-right: 20px;
    border-radius: 7px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }

  .payments-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
  
  .confirmation-text {
    padding: 10px;
    font-weight: thin;
    font-size: 16px;
  }
  
  .email-input {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  
  .acceptance {
    padding: 5px 30px;
    display: flex;
    align-items: center;
  }
  
  .acceptance-text {
    margin-left: 5px;
  }
  
.confirm-payment-button {
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

.confirm-payment-button:hover {
  background-image: linear-gradient(to bottom, #008660, #005a41);
  border-color: #005f44;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.confirm-payment-button-disabled {
  background-image: linear-gradient(to bottom, #bbbbbb, #999999);
  border-color: #999999;
  cursor: not-allowed;
}

.confirm-payment-button-disabled:hover {
  background-image: linear-gradient(to bottom, #bbbbbb, #999999);
  border-color: #999999;
  box-shadow: none;
  transform: none;
}

.summary-row {
    margin-top: 20px;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .summary-total,
  .summary-label{
    font-size: 24px;
  }

</style>