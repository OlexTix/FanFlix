<template>
    <AdminPanelTemplate>
        <p class="title-dashboard">Panel Główny</p>
        <div class="box-bar">
        <div class="bar-status">
            <span class="tile-text-top">Sprzedane bilety</span><br>
            <img src="../../assets/ticket.svg" alt="Ikona 1" class="tile-icon">
            <span class="tile-number">654</span>
        </div>
        <div class="bar-status">
            <span class="tile-text-top">Liczba seansów</span>
            <img src="../../assets/screening.svg" alt="Ikona 2" class="tile-icon">
            <span class="tile-number">21</span>
        </div>
        <div class="bar-status">
            <span class="tile-text-top">Liczba filmow</span>
            <img src="../../assets/admin-assets/movies.svg" alt="Ikona 3" class="tile-icon">
            <span class="tile-number">32</span>
        </div>
        </div>
    </AdminPanelTemplate>
    
</template>

<script>
import AdminPanelTemplate from '../../components/templates/AdminPanelTemplate.vue';
export default {
    components: {
        AdminPanelTemplate
    }
}
</script>

<style>
.title-dashboard {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}
.box-bar {
  display: flex;
  justify-content: flex-start; 
  gap: 1.2rem;
}

.bar-status {
  flex: 1;
  max-width: 17.5rem; 
  height: 7rem; 
  background-color: var(--color-background);  
  border-radius: .6rem;
  display: flex;
  align-items: center;
  padding: .6rem;
  position: relative;
}

.tile-text-top {
  font-size: 1rem; 
  font-weight: bold; 
  margin-bottom: auto; 
}

.tile-icon { 
  height: 2rem; 
  margin-right: 0.5rem; 
}

.tile-number {
  position: absolute; 
  top: 1.5rem; 
  right: 1.5rem; 
}

@media screen and (max-width: 892px) {
  .box-bar {
    flex-direction: column; 
    align-items: flex-start; 
  }
  .bar-status {
    flex: 1;
    max-width: 16rem; 
    height: 6rem; 
    background-color: var(--color-background); 
    border-radius: 10px;
  }
}
</style>