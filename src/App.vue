<template>
  <main>
    <Toast position="bottom-right"/>
    <RouterView />
  </main>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    isDarkMode: localStorage.getItem('theme') === 'dark',
  }),
  mounted() {
    this.emitter.on('toggleTheme', this.toggleTheme);
    this.toggleTheme(this.isDarkMode);
  },
  beforeDestroy() {
    this.emitter.off('toggleTheme', this.toggleTheme);
  },
  methods: {
    toggleTheme(isDarkMode) {
      if (isDarkMode) {
        console.log("Włączono motyw ciemny");
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'dark');
      } else {
        console.log("Włączono motyw jasny");
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    },
  },
}
</script>