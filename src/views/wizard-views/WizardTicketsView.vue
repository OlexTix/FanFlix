<template>
    <Navbar />
    <BaseTemplate>
      <WizardStepsStrip class="wizard-steps" :step="1"/>
      <Divider class="divider-1" />
      <WizardMoviePreview :poster_url="`https://www.cinema-city.pl/xmedia-cw/repo/feats/posters/5474D2R-md.jpg`" />
      <Divider class="divider-2" />
      <WizardTickets/>
    </BaseTemplate>
  </template>
  
  <script>
  import WizardTickets from '../../components/wizard/WizardTicketsComponent.vue';
  import WizardStepsStrip from '../../components/wizard/WizardStepsStripComponent.vue';
  import WizardMoviePreview from '../../components/wizard/WizardMoviePreviewComponent.vue';
  import Navbar from '../../components/Navbar.vue';
  import BaseTemplate from '../../components/templates/BaseTemplate.vue';
  import Divider from '../../components/Divider.vue';
  
  export default {
    components: {
      WizardTickets,
      Navbar,
      BaseTemplate,
      WizardStepsStrip,
      WizardMoviePreview,
      Divider
    },
    data() {
      return {
        movies: [],
      };
    },
    methods: {
      
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