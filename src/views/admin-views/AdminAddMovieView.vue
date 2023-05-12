<template>
    <div class="justify-content-center" id="add-movie">
      <div class="content-container">
        <div class="form-container">
          <h2 class="title">Dodaj film</h2>
          <hr class="divider" />
          <div class="card">
          
              <div class="field" style="margin-right: 1vh;">
                <label for="title" class="input-label">TYTUŁ</label>
                <InputText v-model="title" :class="{ 'p-invalid': errorMessage }" />
                <small class="p-error">{{ errorMessagetitle }}</small>
              </div>
            
              <div class="field" style="margin-right: 1vh;">
                <label for="genres" class="input-label">GATUNKI</label>
                <InputText v-model="genres" :class="{ 'p-invalid': errorMessage }" />
                <small class="p-error">{{ errorMessagegenres }}</small>
            </div>
              <div class="field">
                <label for="director" class="input-label">REŻYSER</label>
                <InputText v-model="director" :class="{ 'p-invalid': errorMessage }" />
                <small class="p-error">{{ errorMessagedirector }}</small>
              </div>
              <div class="field">
                <label for="director" class="input-label">NARODOWOŚĆ</label>
                <InputText v-model="director" :class="{ 'p-invalid': errorMessage }" />
                <small class="p-error">{{ errorMessagedirector }}</small>
              </div>
            
            <div class="field">
              <label for="duration" class="input-label">CZAS TRWANIA</label>
              <InputText v-model="duration" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessageduration }}</small>
            </div>
            <div class="field">
              <label for="release_date" class="input-label">DATA PREMIERY</label>
              <Calendar name="release_date" v-model="release_date" dateFormat="yy-mm-dd"
                :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagerelease_date }}</small>
            </div>

              <Button label="DODAJ FILM" type="submit" severity="primary" rounded id="addbutton"
                @click="register" />
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
  import axios from 'axios';
  export default {
    name: 'AdminAddMovieView',
    components: {
      Button,
      Calendar,
      Checkbox
    },
    data() {
      return {
        title: '',
        genres: '',
        release_date: '',
        duration: '',
        id_director: '',
        errorMessage: '',
        errorMessagetitle: '',
        errorMessagegenres: '',
        errorMessagerelease_date: '',
        errorMessageduration: '',
        errorMessagedirector: '',
      };
    },
    methods: {
  async validate() {
    this.errorMessagetitle = '';
    this.errorMessagegenres = '';
    this.errorMessageduration = '';
    this.errorMessagedirector = '';
    this.errorMessagerelease_date = '';
  
    // Watchers for each input field
    this.$watch('title', () => { this.validateTitle(); });
    this.$watch('genres', () => { this.validateGenres(); });
    this.$watch('duration', () => { this.validateDuration(); });
    this.$watch('director', () => { this.validateDirector(); });
    this.$watch('release_date', () => { this.validateReleaseDate(); });
  
    // Initial validation
    this.validateTitle();
    this.validateGenres();
    this.validateDuration();
    this.validateDirector();
    this.validateReleaseDate();
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
    else if (this.duration.length<=0) {
      this.errorMessageduration = "Czas trwania nie może być równy lub poniżej 0";
    }else {
      this.errorMessageduration = '';
    }
  },
  
  validateDirector() {
    if (this.director.length === 0) {
      this.errorMessagedirector = "Pole Reżyser jest wymagane";
    } else {
      this.errorMessagedirector = '';
    }
  },
  
  validateReleaseDate() {
    if (this.release_date.length === 0) {
      this.errorMessagerelease_date = "Pole Data premiery jest wymagane";
    }  else {
      this.errorMessagerelease_date = '';
    }
  },
  
  async addMovie() {
    this.validate();
    // Check for any validation errors
    if (this.errorMessagetitle || this.errorMessagegenres || this.errorMessageid_director||
        this.errorMessageduration|| this.errorMessagerelease_date) {
      this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Błędy w formularzu. Proszę je poprawić', life: 3000 });
      return;
    }
    try {
      const response = await this.$http.post('/api/panel/movies', {
        title: this.title,
        genres: this.genres,
        id_director: this.id_director,
       duration: this.duration,
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
            break;
          case 500:
            this.errorMessage = `Błąd serwera: ${error.response.data.message}`;
            break;
          default:
            this.errorMessage = 'Wystąpił nieznany błąd';
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
  max-width: 500px;
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
  