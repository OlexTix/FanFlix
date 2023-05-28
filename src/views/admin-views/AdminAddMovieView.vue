<template>
  <div class="justify-content-center" id="add-movie">
    <div class="content-container">
      <div class="form-container">
        <h2 class="title">Dodaj film</h2>
        <hr class="divider" />
        <div class="card">
          <div class="field-row">
            <div class="field" style="margin-right: 1vh;">
              <label for="title" class="input-label">TYTUŁ</label>
              <InputText v-model="title" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagetitle }}</small>
            </div>
            <div class="field">
              <label for="genres" class="input-label">GATUNKI</label>
              <InputText v-model="genres" :class="{ 'p-invalid': errorMessage }" separator="," />
              <small class="p-error">{{ errorMessagegenres }}</small>
            </div>
          </div>
          <div class="field">
            <label for="director" class="input-label">REŻYSER</label>
            <Dropdown v-model="selectedDirector" :options="directors" optionLabel="fullName"
              placeholder="Wybierz reżysera" />
            <small class="p-error">{{ errorMessagedirector }}</small>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="duration" class="input-label">CZAS TRWANIA</label>
              <InputText v-model="duration" style="margin-right: 1vh;" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessageduration }}</small>
            </div>
            <div class="field">
              <label for="release_date" class="input-label">DATA PREMIERY</label>
              <Calendar name="release_date" v-model="release_date" dateFormat="yy-mm-dd"
                :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagerelease_date }}</small>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="poster_url" class="input-label">LINK DO PLAKATU</label>
              <InputText v-model="poster_url" style="margin-right: 1vh;" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessageposter_url }}</small>
            </div>
            <div class="field">
              <label for="youtube_link" class="input-label">LINK DO TRAILERA (YT)</label>
              <InputText v-model="youtube_link" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessageyoutube_link }}</small>
            </div>
          </div>
          <div class="field">
            <label for="description" class="input-label">OPIS</label>
            <Textarea v-model="description" rows="3" cols="30" autoResize="false"
              :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessagedescription }}</small>
          </div>
          <Button label="DODAJ FILM" type="submit" severity="primary" rounded id="addbutton" @click="addMovie" />
          <small class="p-error">{{ errorMessage }}</small>
          <Button label="POWRÓT DO LISTY FILMÓW" type="submit" severity="primary" rounded id="addbutton"
            @click="goBackToList" />
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import axiosInstance from '../../service/apiService';
export default {
  name: 'AdminAddMovieView',
  components: {
    Button,
    Calendar,
    Checkbox,
    Dropdown,
    Textarea
  },
  data() {
    return {
      title: '',
      genres: [],
      release_date: '',
      duration: '',
      description: '',
      poster_url: '',
      youtube_link: '',
      selectedDirector: null,
      directors: [],
      errorMessage: '',
      errorMessagetitle: '',
      errorMessagegenres: '',
      errorMessagerelease_date: '',
      errorMessageduration: '',
      errorMessagedirector: '',
      errorMessagedescription: '',
      errorMessageposter_url: '',
      errorMessageyoutube_link: '',
      fullName: '',
      director: '',
    };
  },
  mounted() {
    this.getDirectors();
  },
  methods: {
    async validate() {
      this.errorMessagetitle = '';
      this.errorMessagegenres = '';
      this.errorMessageduration = '';
      this.errorMessagedirector = '';
      this.errorMessagedescription = '';
      this.errorMessagerelease_date = '';

      // Watchers for each input field
      this.$watch('title', () => { this.validateTitle(); });
      this.$watch('genres', () => { this.validateGenres(); });
      this.$watch('duration', () => { this.validateDuration(); });
      this.$watch('director', () => { this.validateDirector(); });
      this.$watch('release_date', () => { this.validateReleaseDate(); });
      this.$watch('description', () => { this.validateDescription(); });
      this.$watch('poster_url', () => { this.validatePosterUrl(); });
      this.$watch('youtube_link', () => { this.validateYouTubeLink(); });

      // Initial validation
      this.validateTitle();
      this.validateGenres();
      this.validateDuration();
      this.validateDirector();
      this.validateReleaseDate();
      this.validateDescription();
      this.validatePosterUrl();
      this.validateYouTubeLink();
    },

    validateTitle() {
      if (this.title.length === 0) {
        this.errorMessagetitle = "Pole Tytuł jest wymagane";
      } else {
        this.errorMessagetitle = '';
      }
    },
    validateGenres() {
      if (this.genres.length === 0) {
        this.errorMessagegenres = "Pole Gatunki jest wymagane";
      } else {
        this.errorMessagegenres = '';
      }
    },
    validateDuration() {
      if (this.duration.length === 0) {
        this.errorMessageduration = "Pole Czas trwania jest wymagane";
      }
      else if (this.duration.length <= 0) {
        this.errorMessageduration = "Czas trwania nie może być równy lub poniżej 0";
      } else {
        this.errorMessageduration = '';
      }
    },
    validateDirector() {
      if (this.selectedDirector.length === 0) {
        this.errorMessagedirector = "Pole Reżyser jest wymagane";
      } else {
        this.errorMessagedirector = '';
      }
    },
    validateReleaseDate() {
      if (this.release_date.length === 0) {
        this.errorMessagerelease_date = "Pole Data premiery jest wymagane";
      } else {
        this.errorMessagerelease_date = '';
      }
    },
    validateDescription() {
      if (this.description.length === 0) {
        this.errorMessagedescription = "Pole Opis jest wymagane";
      } else {
        this.errorMessagedescription = '';
      }
    },
    validatePosterUrl() {
      if (this.poster_url.length === 0) {
        this.errorMessageposter_url = "Pole Link do plakatu jest wymagane";
      } else {
        this.errorMessageposter_url = '';
      }
    },
    validateYouTubeLink() {
      if (this.youtube_link.length === 0) {
        this.errorMessageyoutube_link = "Pole Link do trailera (YT) jest wymagane";
      } else {
        this.errorMessageyoutube_link = '';
      }
    },
    async getDirectors() {
      try {
        const response = await axiosInstance.get('/api/panel/director');
        this.directors = response.data.map(director => {
          return {
            ...director,
            fullName: `${director.first_name} ${director.last_name}`
          };
        });
      } catch (error) {
        console.error('Błąd pobierania reżyserów:', error);
      }
    },
    async addMovie() {
      this.validate();
      const genresArray = this.genres.split(',').map(genre => genre.trim());
      if (genresArray.length === 0) {
        this.errorMessagegenres = "Pole Gatunki jest wymagane";
        return;
      }
      // Check for any validation errors
      if (this.errorMessagetitle || this.errorMessagegenres || this.errorMessageid_director ||
        this.errorMessageduration || this.errorMessagerelease_date || this.errorMessagedescription || this.errorMessageposter_url || this.errorMessageyoutube_link) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Błędy w formularzu. Proszę je poprawić', life: 3000 });
        return;
      }
      try {
        const response = await this.$http.post('/api/panel/movies', {
          title: this.title,
          director_first_name: this.selectedDirector.first_name,
          director_last_name: this.selectedDirector.last_name,
          director_nationality: this.selectedDirector.director_nationality,
          genres: genresArray,
          duration: this.duration,
          description: this.description,
          poster_url: this.poster_url,
          youtube_link: this.youtube_link,
          release_date: this.release_date,
        });
        console.log(response.data);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('title', response.data.title);
        localStorage.setItem('genres', response.data.genres);
        localStorage.setItem('director', response.data.director);
        localStorage.setItem('duration', response.data.role);
        localStorage.setItem('release_date', response.data.release_date);

        this.errorMessage = '';
        this.$toast.add({ severity: 'info', summary: 'Info', detail: `Pomyślnie dodano film`, life: 3000 });

        if (response.status === 200) {
          const $toastLife = 3000;
          this.$toast.add({ severity: 'info', summary: 'Info', detail: `Pomyślnie dodano film`, life: $toastLife });
          await new Promise(resolve => setTimeout(resolve, $toastLife));
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Błąd dodawania filmu:', error);

        if (error.response) {
          switch (error.response.status) {
            case 400:
              this.errorMessage = 'Błąd dodawania filmu';
              this.$toast.add({
                severity: 'error',
                summary: 'Błąd dodawania filmu',
                detail: '',
                life: 3000
              });
              break;
            case 500:
              this.errorMessage = `Błąd serwera: ${error.response.data.message}`;
              this.$toast.add({
                severity: 'error',
                summary: `Błąd serwera: ${error.response.data.message}`,
                detail: '',
                life: 3000
              });
              break;
            default:
              this.errorMessage = 'Wystąpił nieznany błąd';
              this.$toast.add({
                severity: 'error',
                summary: 'Wystąpił nieznany błąd',
                detail: '',
                life: 3000
              });
          }
        } else {
          this.errorMessage = 'Wystąpił problem z połączeniem';
        }
      }
    },
    goBackToList() {
      this.$router.push('/admin-panel/movies')
    }
  },
};
</script>
  
<style>
#add-movie {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: auto;
  background-color: #1e1e1e;
  border-radius: 20px;
  box-shadow: 0 0 50px 1px rgba(0, 0, 0, 0.25);
  padding: 5vh;
  justify-content: center;
  align-items: center;
  display: flex;
  max-width: 1000px;
}

#addbutton {
  width: 250px;
  height: 40px;
  border-radius: 6px;
  background-image: linear-gradient(to bottom, #00a877, #007d59);
  border-color: #007d59;
  font-weight: 500;
  font-size: 18px;
  color: #ffffff;
  margin: auto;
  display: flex;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  margin-bottom: 2vh;
}

#addbutton:hover {
  background-image: linear-gradient(to bottom, #008660, #005a41);
  border-color: #005f44;
}

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.field {
  display: flex;
  flex-direction: column;
  color: white;
  width: 100%;
  margin-bottom: 20px;
}

.input-label {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

.field-checkbox {
  color: white;
}

.title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 2vh;
  text-align: center;
  margin-top: 2vh;
  color: white;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #ffffff;
  margin-bottom: 20px;
}

.p-error {
  color: red;
  font-weight: bold;
  font-size: 12px;
  margin-top: 1vh;
  word-wrap: break-word;
  word-break: break-all;
}

.accept-error {
  color: red;
  font-weight: bold;
  font-size: 12px;
  margin-top: 1vh;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
  