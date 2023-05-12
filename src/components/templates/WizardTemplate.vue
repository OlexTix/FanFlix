<template>
    <Navbar />
    <BaseTemplate>
      <div v-if="screening">
        <WizardStepsStrip class="wizard-steps" :step="selectedScreeningData.step" />
        <Divider class="divider-1" />
        <WizardMoviePreview :screeningData="screening" />
        <Divider class="divider-2" />
        <slot></slot>
      </div>
    </BaseTemplate>
  </template>
    
<script>
import WizardStepsStrip from '../../components/wizard/WizardStepsStripComponent.vue';
import WizardMoviePreview from '../../components/wizard/WizardMoviePreviewComponent.vue';
import Navbar from '../../components/Navbar.vue';
import BaseTemplate from '../../components/templates/BaseTemplate.vue';
import Divider from '../../components/Divider.vue';
    
export default {
    components: {
        Navbar,
        BaseTemplate,
        WizardStepsStrip,
        WizardMoviePreview,
        Divider
      },
    data() {
        return {
          movies: [],
          selectedScreeningData: null,
          screening: null,
        };
      },
    methods: {
        async fetchScreeningData(screeningID) {
            const response = await this.$http.get(`/api/screenings?id=${screeningID}`);
            this.screening = response.data[0];
            this.updateSelectedScreeningData({
                hallID: Number(this.screening.id_cinema_hall)
            });
            console.log('Otrzymany seans:', this.screening);
        },
        updateSelectedScreeningData(newData) {
        this.selectedScreeningData = JSON.parse(localStorage.getItem('selectedScreeningData')) || {};

        const newSelectedScreeningData = {
            ...this.selectedScreeningData,
            ...newData
        };

        if (newData && newData.hallID !== undefined && newData.hallID !== this.selectedScreeningData.hallID) {
            delete newSelectedScreeningData.tickets;
            delete newSelectedScreeningData.seats;
            newSelectedScreeningData.step = 1;
        }

        const newSelectedScreeningDataJSON = JSON.stringify(newSelectedScreeningData);
        localStorage.setItem('selectedScreeningData', newSelectedScreeningDataJSON);
        this.selectedScreeningData = newSelectedScreeningData;
        },
    },
    mounted() {
        this.updateSelectedScreeningData();

        const step = Number(this.$route.query.step);
        let screeningID = Number(this.$route.query.screeningID);

        if (step) {
            this.updateSelectedScreeningData({ step });
            console.log("Bieżący krok", step);
        }

        if (!screeningID && this.selectedScreeningData) {
            screeningID = this.selectedScreeningData.screeningID;
        }

        if (screeningID) {
            this.updateSelectedScreeningData({ screeningID });
            this.fetchScreeningData(screeningID);
        } else {
            this.$router.push('/');
        return;
        }

        if (this.selectedScreeningData.step) {
            const wizardSteps = ['/', '/wizard/tickets', '/wizard/seats', '/wizard/payments'];
            this.$router.push(`${wizardSteps[this.selectedScreeningData.step]}?screeningID=${screeningID}`);
        }

        window.scrollTo(0, 0);
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