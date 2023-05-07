<template>
    <AdminPanelTemplate>
        <p>Employees</p>
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
        <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id_user }}</td>
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
      filteredUsers: [],
      roleEmployee: 'employee',
      errorMessage: '',
    };
  },
  async created() {
    try {
      const response = await axiosInstance.get('/api/users');
      this.users = response.data;
      this.filteredUsers = this.users.filter(user => user.role === this.roleEmployee);
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