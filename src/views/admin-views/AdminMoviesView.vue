<template>
    <AdminPanelTemplate>
        <p>Movies</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tytuł</th>
          <th>Gatunki</th>
          <th>Reżyser- imię</th>
          <th>Reżyser- nazwisko</th>
          <th>Czas trwania</th>
          <th>Narodowość</th>
          <th>Link YouTube</th>
          <th>Data premiery</th>
          <th>Czynności</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="movie in movies" :key="movie.id">
          <td>{{movie.id_movie }}</td>
          <td>{{movie.title }}</td>
          <td>{{movie.genres }}</td>
          <td>{{movie.first_name }}</td>
          <td>{{movie.last_name }}</td>
          <td>{{movie.duration }}</td>
          <td>{{movie.nationality }}</td>
          <td>{{movie.youtube_link}}</td>
          <td>{{movie.release_date}}</td>
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
      movies: [],
      errorMessage: '',
    };
  },
  async created() {
    try {
      const response = await axiosInstance.get('/api/movies');
      this.movies = response.data;
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