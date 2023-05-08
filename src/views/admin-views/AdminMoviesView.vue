<template>
    <AdminPanelTemplate>
        <p>Movies</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <!-- <table>
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
        </table> -->

        <div class="card">
        <DataView :value="moviesAdmin" paginator :rows="5">
            <template #list="movie">
                <div class="col-12">
                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                        <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto" :src="movie.poster_url" :alt="Poster" />
                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                <div class="text-2xl font-bold text-900">{{ movie.title }}</div>
                                <div class="flex align-items-center gap-3">
                                    <span class="flex align-items-center gap-2">
                                        <i class="pi pi-caret-right"></i>
                                        <span class="font-semibold">Id: {{ movie.id_movie }}</span>
                                    </span>
                                    <span class="flex align-items-center gap-2">
                                        <i class="pi pi-star"></i>
                                        <span class="font-semibold">Gatunek: {{ movie.genres }}</span>
                                    </span>
                                    <!-- <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)"></Tag> -->
                                </div>
                            </div>
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <span class="text-1xl">Czas: {{ movie.duration }}</span>
                                <div class="button-template">
                                   <Button icon="pi pi-pencil" rounded></Button>
                                <Button icon="pi pi-trash" rounded></Button> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
    </div>

    </AdminPanelTemplate>
</template>

<script>
import axios from 'axios';
import axiosInstance from '../../service/apiService.js';
import { ref, onMounted } from 'vue';
import AdminPanelTemplate from '../../components/templates/AdminPanelTemplate.vue';

onMounted(() => {
  apiService.axios.create().then((data) => (movie.value = data));
});

const moviesAdmin = ref();

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
/* table {
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
} */
</style>