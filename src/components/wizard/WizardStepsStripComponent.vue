<template>
  <div class="container">
    <RouterLink 
      class="text-button" 
      :class="{ active: step === 1, disabled: 1 > step }" 
      :to="1 <= step ? '/wizard/tickets?step=1' : '#'">BILETY
    </RouterLink>
    <img 
      src="../../assets/wizzard-arrows.svg" 
      alt="First Icon" 
      class="icon" />
    <RouterLink 
      class="text-button" 
      :class="{ active: step === 2, disabled: 2 > step }" 
      :to="2 <= step ? '/wizard/seats?step=2' : '#'">MIEJSCA
    </RouterLink>
    <img 
      src="../../assets/wizzard-arrows.svg" 
      alt="Second Icon" 
      class="icon" />
    <RouterLink 
      class="text-button" 
      :class="{ active: step === 3, disabled: 3 > step }" 
      :to="3 <= step ? '/wizard/payments?step=3' : '#'">PŁATNOŚĆ
    </RouterLink>
  </div>
</template>

<script>
import { RouterLink} from 'vue-router';
export default {
  name: 'WizardStepsStripComponent',
  props: {
    step: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #1e1e1e00, rgba(0, 0, 0, 0.53) 50%, #1e1e1e00);
  height: 65px;
  padding: 0 15px;
}

.text-button {
  font-size: 24px;
  font-weight: 500;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
}

.text-button.active {
  color: #01835d;
}

.icon {
  height: 20px;
  padding: 0 5px;
}

.text-button.disabled {
  cursor: not-allowed;
  color: #888;
}
</style>