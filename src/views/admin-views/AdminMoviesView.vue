<template>
  <AdminPanelTemplate>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <div class="movie-table">
      <div class="table-tab">
        <h1 class="table-title">FILMY</h1>
      </div>
      <div class="header-content">
        <div class="search-input">
          <InputText v-model="searchTerm" placeholder="Wyszukaj..." @input="searchMovies" />
        </div>
        <Button class="add-button" @click="addMovie">DODAJ FILM</Button>
      </div>
      <DataTable :value="filteredMovies" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" editMode="cell"
        sortMode="multiple" @cell-edit-complete="onCellEditComplete" tableClass="editable-cells-table"
        tableStyle="min-width: 50rem" :sortField="sortField" :sortOrder="sortOrder" @sort-change="onSortChange">
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :editable="col.editable"
          :sortable="col.sortable">
          <template #body="{ data, field }">
            <template v-if="field === 'poster_url'">
              <img :src="data[field]" alt="Poster" class="poster-image" />
            </template>
            <template v-else>
              {{ data[field] }}
            </template>
          </template>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" v-if="col.field !== 'id_movie'" autofocus />
            <span v-else>{{ data[field] }}</span>
          </template>
        </Column>
        <Column>
          <template #header="slotProps">
          </template>
          <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-success"
                            @click="editMovie(slotProps.data.id_movie)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger"
              @click="deleteMovie(slotProps.data.id_movie)" />
            <Button icon="pi pi-image" class="p-button-rounded" @click="openPoster(slotProps.data.title)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </AdminPanelTemplate>
</template>

<script>
import axiosInstance from "../../service/apiService.js";
import AdminPanelTemplate from "../../components/templates/AdminPanelTemplate.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";

export default {
  components: {
    AdminPanelTemplate,
    DataTable,
    Column,
    InputText,
    Button,
    Toolbar,
  },
  data() {
    return {
      movies: [],
      filteredMovies: [],
      errorMessage: "",
      columns: [
        { field: "id_movie", header: "ID", editable: false, sortable: true },
        { field: "title", header: "Tytuł", editable: true, sortable: true },
        { field: "genres", header: "Gatunki", editable: true, sortable: true },
        {
          field: "id_director",
          header: "ID reżysera",
          editable: true,
          sortable: true,
        },
        {
          field: "director_first_name",
          header: "Reżyser - imię",
          editable: true,
          sortable: true,
        },
        {
          field: "director_last_name",
          header: "Reżyser - nazwisko",
          editable: true,
          sortable: true,
        },
        {
          field: "duration",
          header: "Czas trwania",
          editable: true,
          sortable: true,
        },
        {
          field: "director_nationality",
          header: "Narodowość",
          editable: true,
          sortable: true,
        },
        {
          field: "youtube_link",
          header: "Link YouTube",
          editable: false,
          sortable: true,
        },
        {
          field: "release_date",
          header: "Data premiery",
          editable: false,
          sortable: true,
        },
        {
          field: "poster_url",
          header: "Plakat",
          editable: true,
          sortable: true,
        },
      ],
      sortField: null,
      sortOrder: null,
    };
  },
  computed: {
    fetchedMovies() {
      return this.movies;
    },
  },
  beforeMount() {
    this.fetchMovies();
  },
  methods: {
    async getMoviePosterUrl(movie_title) {
      try {
        const response = await axiosInstance.get(`/api/movies/${movie_title}`);
        const movie = response.data;
        return movie.poster_url;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async openPoster(movie_title) {
      const posterUrl = await this.getMoviePosterUrl(movie_title);
      if (posterUrl) {
        window.open(posterUrl, "_blank");
      } else {
        // Obsłuż błąd braku linku do plakatu
        this.$toast.add({
          severity: "error",
          summary: "Brak linku do plakatu",
          detail: "",
          life: 3000,
        });
      }
    },
    async fetchMovies() {
      try {
        const response = await axiosInstance.get("/api/panel/movies");
        const movies = response.data.map(movie => {
          // Format genres as a comma-separated string
          const genres = movie.genres.join(", ");

          // Format release_date as yyyy-mm-dd
          const releaseDate = new Date(movie.release_date).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
            .split(".")
            .join(".");

          return { ...movie, genres, release_date: releaseDate };
        });
        this.movies = movies;
        this.filteredMovies = movies;
      } catch (error) {
        console.error(error);
      }
    },
    async onCellEditComplete(event) {
      const { data, newValue, field } = event;
      const originalValue = data[field];

      if (newValue === originalValue) {
        // Wartość pola nie zmieniła się, nie wykonuj żądania PUT
        return;
      }

      try {
        await axiosInstance.put(`/api/panel/movies/${data.id_movie}`, {
          [field]: newValue,
        });
        this.$toast.add({
          severity: "info",
          summary: "Pomyślnie zaktualizowano film",
          detail: "",
          life: 3000,
        });
        await this.fetchMovies(); // Aktualizacja danych po zapisaniu zmian
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "Błąd przy aktualizacji filmu",
          detail: "",
          life: 3000,
        });
      }
    },
    searchMovies() {
      if (this.searchTerm) {
        const regex = new RegExp(this.searchTerm, "i");
        this.filteredMovies = this.movies.filter((movie) => {
          for (const field in movie) {
            if (regex.test(String(movie[field]))) {
              return true;
            }
          }
          return false;
        });
      }
      else if (!this.searchTerm || /^\s*$/.test(this.searchTerm)) {
        this.filteredMovies = this.movies;
      }

      else {
        this.filteredMovies = this.movie;
      }
    },

    async onSortChange(event) {
      const { sortField, sortOrder } = event;
      this.sortField = sortField;
      this.sortOrder = sortOrder;

      try {
        const response = await axiosInstance.get("/api/panel/movies", {
          params: { sortField, sortOrder },
        });
        this.movies = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async deleteMovie(id_movie) {
      try {
        await axiosInstance.delete(`/api/panel/movies/${id_movie}`);
        await this.fetchMovies();
        this.$toast.add({
          severity: "info",
          summary: "Pomyślnie usunięto film",
          detail: "",
          life: 3000,
        });
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "Błąd przy usuwaniu filmu",
          detail: "",
          life: 3000,
        });
      }
    },
    addMovie() {
      this.$router.push('/admin-panel/movies/add-movie');
    },
    editMovie(id_movie) {
      this.$router.push({ name: "edit-movie", params: { id_movie: id_movie } });
    },
  },
};
</script>

<style scoped>
.custom-datatable {
  background-color: #2c2b2b;
  border: 3px solid #007d59;
}

.custom-datatable thead {
  background-color: #2c2b2b;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-input {
  flex: 1;
  margin-left: 1vh;
}

.add-button {
  border-radius: 6px;
  background-image: linear-gradient(to bottom, #00a877, #007d59);
  border-color: #007d59;
  font-weight: 500;
  width: 150px;
  font-size: 15px;
  margin-left: 2vh;
  color: #ffffff;
  margin-top: 1vh;
  display: flex;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  align-self: flex-start;
}

.add-button:hover {
  background-image: linear-gradient(to bottom, #008660, #005a41);
  border-color: #005f44;
}

.table-tab {
  height: 40px;
  border-radius: 5px 5px 0px 0px;
  background-image: linear-gradient(to bottom, #00a877, #007d59);
  border-color: #007d59;
  font-size: 18px;
  color: #000000;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.movies-table {
  box-shadow: 0 0 50px 1px rgba(0, 0, 0, 0.25);
}

.cell {
  background-color: #333;
  color: #fff;
}

.p-editable-column {
  background-color: #333;
  color: #fff;
}

.p-datatable .p-datatable-thead>tr>th {
  background-color: #333;
  color: #fff;
}

.p-paginator.p-component {
  background-color: #333;
  color: #fff;
}

td {
  background-color: #333;
  color: #fff;
}

.table-title {
  font-weight: 600;
  color: white;
  text-align: center;
  vertical-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@media screen and (max-width: 768px) {
  .movies-table {
    overflow-x: auto;
  }
}

.poster-image {
  max-width: 80px;
  max-height: 80px;
}
</style>
