<template>
  <div class="dashboard">
    <div class="dashboard-tiles">
      <div class="dashboard-tile">
        <div class="dashboard-tile-header">
          <h3 class="dashboard-tile-title">{{ userCount }}</h3>
          <h2 class="dashboard-tile-subtitle"> (+1234)</h2>
        </div>
        <div class="dashboard-tile-body">
          <p class="dashboard-tile-info">Users</p>
        </div>
      </div>
      <div class="dashboard-tile">
        <div class="dashboard-tile-header">
          <h3 class="dashboard-tile-title">{{ totalVisits }}</h3>
          <h2 class="dashboard-tile-subtitle"> (+1234)</h2>
        </div>
        <div class="dashboard-tile-body">
          <p class="dashboard-tile-info">Total visits</p>
        </div>
      </div>
      <div class="dashboard-tile">
        <div class="dashboard-tile-header">
          <h3 class="dashboard-tile-title">{{ employeeCount }}</h3>
          <h2 class="dashboard-tile-subtitle"> (+1234)</h2>
        </div>
        <div class="dashboard-tile-body">
          <p class="dashboard-tile-info">Employees</p>
        </div>
      </div>
    </div>
    <div class="dashboard-charts">
      <div class="dashboard-chart">
        <!-- Placeholder for line chart 1 -->
      </div>
      <div class="dashboard-chart">
        <!-- Placeholder for line chart 2 -->
      </div>
      <div class="dashboard-chart">
        <!-- Placeholder for line chart 3 -->
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      userCount: 0,
      totalVisits: 0,
      employeeCount: 0
    };
  },
  mounted() {
    // Call API to get data for userCount, totalVisits, and employeeCount
    // Set data properties with API response
  }
};
</script>
  
<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4vh;
  justify-content: flex-start;
  width: 80%;
  float: left;
}

.dashboard-tiles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.dashboard-tile {
  background-color: var(--color-logo);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin-right: 20px;
  margin-bottom: 20px;
  min-width: 200px;
}

.dashboard-tile-header {
  background-color: var(--color-logo);
  padding: 1.2vh;
  border-radius: 5px 5px 0 0;
  display: inline-flex;
}

.dashboard-tile-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
}

.dashboard-tile-subtitle {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  vertical-align: middle;
}

.dashboard-tile-body {
  padding: 15px;
}



.dashboard-tile-info {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.dashboard-charts {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.dashboard-chart {
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  min-width: calc(33.33% - 10px);
}</style>