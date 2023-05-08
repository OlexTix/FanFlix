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
                    <th>Czynności</th>
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
                    <td>
                        <button  class="delete-button" @click="deleteUser(user.id_user)">Usuń</button>
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
    methods: {
        async deleteUser(userId) {
            try {
                await axiosInstance.delete(`/api/users/${userId}`);
                const response = await axiosInstance.get('/api/users');
                this.users = response.data;
                this.filteredUsers = this.users.filter(user => user.role === this.roleEmployee);
            } catch (error) {
                console.error(error);
            }
        },
    },
}
</script>
<style>
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
}

td,
th {
    padding: 0.5rem;
    text-align: left;
    border: 1px solid #ddd;
}

th {
    font-weight: bold;
}

.delete-button {
    border-radius: 6px;
    background-image: linear-gradient(to bottom, #a80000, #5b0101);
    border-color: #650a0a;
    font-weight: 700;
    font-size: 18px;
    color: #ffffff;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    cursor: pointer;
  }

  .delete-button:hover {
    background-image: linear-gradient(to bottom, #420505, #550404);
    border-color: #4a0707;
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
}
</style>