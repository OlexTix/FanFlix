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
                    <td>{{ movie.id_movie }}</td>
                    <td>{{ movie.title }}</td>
                    <td>{{ movie.genres }}</td>
                    <td>{{ movie.first_name }}</td>
                    <td>{{ movie.last_name }}</td>
                    <td>{{ movie.duration }}</td>
                    <td>{{ movie.nationality }}</td>
                    <td>{{ movie.youtube_link }}</td>
                    <td>{{ movie.release_date }}</td>
                    <td>
                        <button class="delete-button" @click="deleteMovie(movie.id_movie)">Usuń</button>
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
    methods: {
        async deleteMovie(movieId) {
            try {
                await axiosInstance.delete(`/api/movies/${movieId}`);
                const response = await axiosInstance.get('/api/movies');
                this.movies = response.data;
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