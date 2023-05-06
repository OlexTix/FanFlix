<template>
  <div class="base-template-container">
    <div class="base-template" :style="styleObject">
      <slot class="base-template-content"></slot>
    </div>
    <Footer class="footer"/>
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
    transition: 'padding 0.3s ease',
  }

  if (windowWidth.value <= 500) {
    baseStyle.paddingLeft = '5px'
    baseStyle.paddingRight = '5px'
  }

  return baseStyle
})
</script>

<style scoped>
.base-template-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.base-template {
  width: 100%;
  background-color: var(--color-background-pres);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.footer {
  width: 100%;
}

.base-template-content {
  flex-grow: 1;
}
</style>