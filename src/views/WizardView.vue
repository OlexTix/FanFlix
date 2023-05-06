<template>
    <Navbar />
    <main class="main-container">
      <div class="wizard-container">
        <WizardPaymentBox/>
      </div>
      <Footer />
    </main>
  </template>
  
  
  <script>
  import { defineComponent } from "vue"
  import Navbar from "../components/Navbar.vue"
  import BaseTemplate from "../components/templates/BaseTemplate.vue"
  import Footer from '../components/Footer.vue'
  import WizardPaymentBox from "../components/wizard/WizardPaymentBox.vue"
  
  export default defineComponent({
    name: 'WizardView',
    components: {
      Navbar,
      BaseTemplate,
      Footer,
      WizardPaymentBox,
    }
  })
  </script>
  
  <style scoped>
  .main-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .wizard-container {
    flex-grow: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  </style>