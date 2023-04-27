<template>
  <AdminPanelSideMenu />
  <dashboard-chart></dashboard-chart>
</template>

<script>
import AdminPanelSideMenu from "../components/AdminPanelSideMenu.vue"
import DashboardChart from "@/components/DashboardChart.vue";

export default {
  components: {
    AdminPanelSideMenu,
    DashboardChart,
  },
  data() {
    return {
      userCount: 0,
      totalVisits: 0,
      employeeCount: 0,
    };
  },
  mounted() {
    // retrieve data for userCount, totalVisits, and employeeCount
    // and set them to the corresponding data properties
  },
};
</script>
