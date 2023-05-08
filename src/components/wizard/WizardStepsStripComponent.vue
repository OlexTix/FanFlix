<template>
  <div class="container">
    <button class="text-button" :class="{ active: step === 1 }">BILETY</button>
    <img src="../../assets/wizzard-arrows.svg" alt="First Icon" class="icon" />
    <button class="text-button" :class="{ active: step === 2 }">MIEJSCA</button>
    <img src="../../assets/wizzard-arrows.svg" alt="Second Icon" class="icon" />
    <button class="text-button" :class="{ active: step === 3 }">PŁATNOŚĆ</button>
  </div>
</template>

<script>
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
  color: #f00; /* Adjust the active color as needed */
}

.icon {
  height: 20px;
  padding: 0 5px;
}
</style>