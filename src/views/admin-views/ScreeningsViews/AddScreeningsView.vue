<template>
    <AdminPanelTemplate>
        <ScreeningsMenu class="screenings-menu"/>
        <div class="center">
            <div class="left-side">
                <div class="field">
                    <div class="date-container">
                        <label>Data</label>
                        <Calendar 
                            id="datee"
                            v-model="selected.date" 
                            :minDate="minDate" 
                            :maxDate="maxDate"
                            inline 
                            showTime 
                            hourFormat="24"/>
                    </div>
                </div>
            </div>
            <div class="right-side">
                <div class="field">
                    <label for="name" class="mb-3">Kino</label>
                    <div class="flex-container-icon">
                        <Dropdown
                            id="name"
                            required="true"
                            autofocus
                            v-model.trim="selected.cinema" 
                            :options="cinemas" 
                            optionLabel="name" 
                            placeholder="Wybierz kino"
                            :maxSelectedLabels="3" 
                            @change="fetchHallNumbers"
                            style="min-width:410px;"/>
                        <Button 
                            icon="pi pi-plus" 
                            v-tooltip.right="'Dodaj kino'" 
                            placeholder="Right"
                            outlined 
                            rounded 
                            class="dropdown-icon mr-2"/>
                    </div>
                </div>

                <div class="field">
                    <label for="id_movie" class="mb-3">Film</label>
                    <div class="flex-container-icon">
                        <Dropdown
                            id="id_movie"
                            required="true"
                            autofocus
                            v-model.trim="selected.movie" 
                            :options="movies" 
                            optionLabel="title" 
                            placeholder="Wybierz film"
                            :maxSelectedLabels="3" 
                            style="width:410px"/>
                        <Button 
                            icon="pi pi-plus" 
                            v-tooltip.right="'Dodaj film'" 
                            placeholder="Right"
                            @click="()=>redirectToAddMovie()"
                            outlined 
                            rounded 
                            class="dropdown-icon mr-2"/>
                    </div>
                </div>

                <div class="field">
                    <label for="language">Rodzaj seansu</label>
                    <div class="flex-container-icon">
                        <Dropdown
                            id="language"
                            required="true"
                            autofocus
                            v-model.trim="selected.screeningType" 
                            :options="screeningTypes" 
                            optionLabel="language"
                            placeholder="Wybierz rodzaj seansu"
                            :maxSelectedLabels="3"  
                            style="width:410px"/>
                        <Button 
                            icon="pi pi-plus" 
                            v-tooltip.right="'Dodaj rodzaj seansu'" 
                            placeholder="Right"
                            outlined 
                            rounded 
                            class="dropdown-icon mr-2"/>
                    </div>
                </div> 

                <div class="field">
                    <label for="hallNumber">Sala</label>
                    <div class="flex-container-icon">
                        <Dropdown
                            id="hallNumber"
                            required="true"
                            autofocus
                            v-model.trim="selected.hallNumber" 
                            :options="hallNumbers" 
                            optionLabel="hall_number"
                            placeholder="Wybierz salę"
                            :maxSelectedLabels="3" 
                            style="width:410px"/>
                        <Button 
                            icon="pi pi-plus" 
                            v-tooltip.right="'Dodaj salke'" 
                            placeholder="Right"
                            outlined 
                            rounded 
                            class="dropdown-icon"/>
                    </div>
                </div>

                <div class="field">
                    <Button class="button-submit" type="button" rounded label="Dodaj seans" icon="pi pi-check" @click="submit" />
                </div>
            </div>
        </div>
            
    </AdminPanelTemplate>
</template>



<script>
import AdminPanelTemplate from '../../../components/templates/AdminPanelTemplate.vue';
import ScreeningsMenu from '../../../components/admin/screenings/ScreeningsMenuComponent.vue';
import axiosInstance from '../../../service/apiService';

export default {
    components: {
        AdminPanelTemplate,
        ScreeningsMenu
    },
    data() {
        return {
        cinemas: null,
        movies: null,
        screeningTypes: null,
        hallNumbers: null,
        selected: {
            cinema: null,
            movie: null,
            screeningType: null,
            hallNumber: null,
            date: null
        },
        minDate: new Date(),
        maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        };
    },
    async mounted(){
        this.cinemas = await this.fetchCinemas();
        this.movies = await this.fetchMovies();
        this.screeningTypes = await this.fetchScreeningTypes();
    },
    watch: {
        'selected.cinema': {
            immediate: true,
            deep: true,
            async handler(newValue) {
                if(newValue){
                    await this.fetchHallNumbers(); 
                }
            }
        },
        screening: {
        immediate: true,
        deep: true,
        async handler(newValue) {
            if (newValue && this.cinemas && this.movies && this.screeningTypes) {
                this.selected.cinema = this.cinemas.find(cinema => cinema.name === newValue.name);
                this.selected.movie = this.movies.find(movie => movie.id_movie === newValue.id_movie);
                this.selected.screeningType = this.screeningTypes.find(type => type.language === newValue.language);
                await this.fetchHallNumbers();
                this.selected.hallNumber = this.hallNumbers.find(type => type.hall_number === newValue.hall_number);
                this.selected.date = newValue.date;
            }
        }
        }
    },
    methods: {
        async submit() {
            try {
                let dateTime = new Date(this.selected.date);

                let date = dateTime.toISOString().split('T')[0];
                let hours = dateTime.getHours().toString().padStart(2, '0');
                let minutes = dateTime.getMinutes().toString().padStart(2, '0');
                let time = `${hours}:${minutes}`;

                const screeningData = {
                    movieTitle: this.selected.movie.title,
                    hallNumber: this.selected.hallNumber.hall_number,
                    language: this.selected.screeningType.language, 
                    date: date,
                    time: time
                };
                console.log("Wysłano seans: ", screeningData);
                await axiosInstance.post(
                    `/api/panel/screenings`, 
                    screeningData
                );
                this.$toast.add({
                    severity: "info",
                    summary: "Pomyślnie dodano seans",
                    detail: "",
                    life: 2000,
                });
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Błąd przy dodawaniu seansu",
                    detail: "",
                    life: 2000,
                });
            }
            //this.$emit('screeningSaved', this.screening);
            
        },
        redirectToAddMovie(){
            this.$router.push('/admin-panel/movies/add-movie');
        },
        closeDialog() {
            this.$emit('update:visible', false);
            this.submitted = false;
        },
        async fetchMovies(){
            const response = await this.$http.get(`/api/movies`);
            console.log("Pobrane filmy:", response.data);
            return response.data;
        },
        async fetchCinemas(){
            const response = await this.$http.get(`/api/cinemas`);
            console.log("Pobrane kina:", response.data);
            return response.data;
        },
        async fetchScreeningTypes(){
            const response = await this.$http.get(`/api/screeningTypes`);
            console.log("Pobrane rodzaje seansów:", response.data);
            return response.data;
        },
        async fetchHallNumbers(){
            if(this.selected.cinema) {
                const response = await this.$http.get(`/api/hallNumbers?cinemaName=${this.selected.cinema.name}`);
                console.log(`Pobrane numery sal dla kina ${this.selected.cinema.name}:`, response.data);
                this.hallNumbers = response.data;
            }
        },
    },
};
</script>

<style scoped>
.screenings-menu {
    margin-bottom: 2rem;
}

.center {
    display: flex;
    justify-content: center; 
    align-items: flex-start;
    padding: 2rem;
    flex-wrap: wrap;
    margin: auto;
}

.left-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end; 
}

.right-side {
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
}

.left-side, .right-side {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
    margin: 0 1rem;
    align-self: center;
}

.field {
    padding-bottom: 15px;
    display: flex;
    flex-direction: column;
}

.flex-container-icon {
    display: flex;
    align-items: center;
}

.date-container {
    display: flex;
    flex-direction: column;
    align-items: start;
}

.date-container label, .flex-container-icon label {
    margin-right: 1rem;
}

.dropdown-icon {
    margin-left: 1rem;
    cursor: pointer;
}

.field button {
    max-width: 200px;
}

.button-submit{
    margin-top: 2rem;
    margin-left: 7rem;
    min-width: 15rem;
}

@media (max-width: 768px) {
    .left-side, .right-side {
        flex-basis: 100%;
        justify-content: center;
        align-items: center;
    }
    .button-submit{
        margin-left: 0;
    }
    .date-container{
        margin-right: 50px;
    }
}

@media (max-width: 1320px) {
    .left-side, .right-side {
        flex-basis: 100%;
        justify-content: center;
        align-items: center;
    }
    .button-submit{
        margin-left: 0;
    }
    .date-container{
        margin-right: 50px;
    }
}
</style>
