<template>
    <AdminPanelTemplate>
        <p>Users</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Imię</th>
          <th>Nazwisko</th>
          <th>Email</th>
          <th>Rola</th>
          <th>Numer telefonu</th>
          <th>Data urodzenia</th>
          <th>Ostatnie logowanie</th>
          <th>Data rejestracji</th>
          <th>Konto aktywowane?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.first_name }}</td>
          <td>{{ user.last_name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.birth_date }}</td>
          <td>{{ user.last_login }}</td>
          <td>{{ user.registration_date }}</td>
          <td>{{ user.is_active }}</td>
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
      users: [],
      errorMessage: '',
    };
  },
  async created() {
    try {
      const response = await axiosInstance.get('/api/users');
      this.users = response.data;
    } catch (error) {
      console.error(error);
    }
  },
}
</script>