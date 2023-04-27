<template>
  <div class="base-template-container">
    <div class="base-template" :style="styleObject">
      <slot></slot> <!-- Allows you to insert other components -->
    </div>
    <Footer />
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Footer from '../../components/Footer.vue'

const props = defineProps({
  padding: {
    type: String,
    default: '65px'
  },
})

const windowWidth = ref(window.innerWidth)

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

const styleObject = computed(() => {
  const baseStyle = {
    paddingLeft: props.padding,
    paddingRight: props.padding,
    transition: 'padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out',
  }

  if (windowWidth.value <= 500) {
    baseStyle.paddingLeft = '5px'
    baseStyle.paddingRight = '5px'
  }

  return baseStyle
})
</script>
<style>
.base-template-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.base-template {
  width: 100%;
  max-width: 1024px;
  background-color: var(--color-background-pres);
  display: flex;
  flex-direction: column;
}

.base-template {
  -webkit-transition: padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out;
  -moz-transition: padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out;
  -o-transition: padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out;
  transition: padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out;
}

Footer {
  width: 100%;
  max-width: 1024px;
}
</style>