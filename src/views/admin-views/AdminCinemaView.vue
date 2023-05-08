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
                    <th>Czynności</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cinema in cinemas" :key="cinema.id">
                    <td>{{ cinema.id_cinema }}</td>
                    <td>{{ cinema.name }}</td>
                    <td>{{ cinema.id_address }}</td>
                    <td>{{ cinema.phone }}</td>
                    <td>{{ cinema.street }}</td>
                    <td>{{ cinema.building_number }}</td>
                    <td>{{ cinema.apartment_number }}</td>
                    <td>{{ cinema.postal_code }}</td>
                    <td>{{ cinema.city }}</td>
                    <td>{{ cinema.country }}</td>
                    <td>
                        <button class="delete-button" @click="deleteCinema(cinema.id_cinema)">Usuń</button>
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
    methods: {
        async deleteCinema(cinemaId) {
            try {
                await axiosInstance.delete(`/api/cinemas/${cinemaId}`);
                const response = await axiosInstance.get('/api/cinemas');
                this.cinemas = response.data;
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