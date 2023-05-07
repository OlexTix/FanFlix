<template>
    <AdminPanelTemplate>
        <p>Cinemas</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nazwa</th>
          <th>Adres</th>
          <th>Nr tel</th>
          <th>Ulica</th>
          <th>Nr budynku</th>
          <th>Nr lokalu</th>
          <th>Kod pocztowy</th>
          <th>Miejscowość</th>
          <th>Kraj</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cinema in cinemas" :key="cinema.id">
          <td>{{cinema.id_cinema }}</td>
          <td>{{cinema.name }}</td>
          <td>{{cinema.id_address}}</td>
          <td>{{cinema.phone}}</td>
          <td>{{cinema.street}}</td>
          <td>{{cinema.building_number}}</td>
          <td>{{cinema.apartment_number}}</td>
          <td>{{cinema.postal_code}}</td>
          <td>{{cinema.city}}</td>
          <td>{{cinema.country}}</td>
          <td>
            
          </td>
        </tr>
      </tbody>
    </table>
  
    </AdminPanelTemplate>
    
</template>

<script>
import axios from 'axios';
import axiosInstance from '../../service/apiService.js';

import AdminPanelTemplate from '../../components/templates/AdminPanelTemplate.vue';
export default {
    components: {
        AdminPanelTemplate
    },
    data() {
    return {
      cinemas: [],
      errorMessage: '',
    };
  },
  async created() {
    try {
      const response = await axiosInstance.get('/api/cinemas');
      this.cinemas = response.data;
    } catch (error) {
      console.error(error);
    }
  },
 
    
}
</script>
<style>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #ccc;
}

th {
  font-weight: bold;
  background-color: #f1f1f1;
}

.button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin: 0.5rem 0;
  cursor: pointer;
  border-radius: 4px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
}

.header .button-container {
  display: flex;
  align-items: center;
}</style>