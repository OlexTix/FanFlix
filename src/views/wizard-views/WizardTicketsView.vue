<template>
  <Navbar />
  <BaseTemplate>
    <div v-if="screening">
      <WizardStepsStrip class="wizard-steps" :step="step" />
      <Divider class="divider-1" />
      <WizardMoviePreview :screeningData="screening" />
      <Divider class="divider-2" />
      <WizardTickets v-if="step === 1" @selected-tickets="onSelectedTickets" />
      <WizardSits v-if="step === 2" :hallID="screening.id_cinema_hall" :ticketsCount="ticketsCount" @selected-seats="onSelectedSeats" />
      <WizardMentzen v-if="step === 3" :selected-screening-data.tickets="selectedTickets" />
    </div>
  </BaseTemplate>
</template>
  
  <script>
  import WizardTickets from '../../components/wizard/WizardTicketsComponent.vue';
  import WizardSits from '../../components/wizard/WizardSitsComponent.vue';
  import WizardMentzen from '../../components/wizard/WizardPaymentsComponent.vue';
  import WizardStepsStrip from '../../components/wizard/WizardStepsStripComponent.vue';
  import WizardMoviePreview from '../../components/wizard/WizardMoviePreviewComponent.vue';
  import Navbar from '../../components/Navbar.vue';
  import BaseTemplate from '../../components/templates/BaseTemplate.vue';
  import Divider from '../../components/Divider.vue';
  
  export default {
    components: {
      WizardTickets,
      WizardSits,
      WizardMentzen,
      Navbar,
      BaseTemplate,
      WizardStepsStrip,
      WizardMoviePreview,
      Divider
    },
    data() {
      return {
        movies: [],
        ticketsCount: null,
        selectedTickets: null,
        selectedSeats: null,
        screening: null,
        step: 1,
      };
    },
    methods: {
    async fetchScreeningData() {
      const screeningID = this.$route.query.screeningID;
      const response = await this.$http.get(`/api/screenings?id=${screeningID}`);
      this.screening = response.data[0];
      console.log('Otrzymany seans:', this.screening);
    },
    onSelectedTickets(tickets) {
      this.selectedTickets = tickets;
      this.ticketsCount = tickets.reduce((total, ticket) => total + ticket.quantity, 0);
      this.step = 2;
    },
    onSelectedSeats(seats) {
      this.selectedSeats = seats;
      this.step = 3;
    },
  },
  mounted() {
    this.fetchScreeningData();
  },
  };
  </script>

<style scoped>
.wizard-steps {
  margin-top: 20px;
  margin-bottom: 10px;
}

.divider-1 {
  margin-bottom: 10px;
}

.divider-2 {
  margin-top: 10px;
  margin-bottom: 20px;
}

</style>