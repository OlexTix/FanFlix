<template>
    <div>
        <div class="card">
            <DataTable 
                ref="dt" 
                :value="screenings" 
                v-model:selection="selectedScreening"
                dataKey="id" 
                :paginator="true" 
                :rows="5" 
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Wyświetlono {first} do {last} z {totalRecords}">

                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
						<span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Szukaj..." />
                        </span>
					</div>
                </template>

                <Column field="movie_title" header="Tytuł" sortable>
                    <template #body="slotProps">
                        {{ slotProps.data.movie_title }}
                    </template>
                </Column>
                <Column field="name" header="Kino" sortable>
                    <template #body="slotProps">
                        {{ slotProps.data.name }}
                    </template>
                </Column>
                <Column field="hall_number" header="Sala" sortable>
                    <template #body="slotProps">
                        {{slotProps.data.hall_number}}
                    </template>
                </Column>
                <Column field="date" header="Data" sortable>
                    <template #body="slotProps">
                        {{ `${slotProps.data.date} ${slotProps.data.time}` }}
                    </template>
                </Column>
                <Column field="language" header="Rodzaj" sortable>
                    <template #body="slotProps">
                        {{ slotProps.data.language }}
                    </template>
                </Column>
                <Column :exportable="false">
                    <template #body="slotProps">
                        <Button class="table-icon mr-2" icon="pi pi-pencil" outlined rounded @click="editScreening(slotProps.data)" />
                        <Button class="table-icon" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteScreening(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <ScreeningDialogComponent
            :visible="screeningDialog" 
            @update:visible="screeningDialog = $event"
            :screening="screening" 
            :submitted="submitted"/>

        <ConfirmationDialogComponent
            :visible="deleteScreeningDialog" 
            @update:visible="deleteScreeningDialog = $event"
            :item="screening" 
            @confirm="deleteScreening"/>

	</div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import ScreeningDialogComponent from './ScreeningDialogComponent.vue';
import ConfirmationDialogComponent from './ConfirmationDialogComponent.vue';
import axiosInstance from '../../../service/apiService';

export default {
    components: {
        ScreeningDialogComponent,
        ConfirmationDialogComponent
    },
    data() {
        return {
            selectedScreeningType: null,
            screenings: null,
            date: null,
            screening: {},
            selectedScreening: null,
            screeningDialog: false,
            deleteScreeningDialog: false,
            deleteProductsDialog: false,
            selectedProducts: null,
            filters: {},
            submitted: false
        }
    },
    created() {
        this.initFilters();
    },
    mounted() {
        this.fetchScreeningsWithMovieTitle().then((data) => (this.screenings = data));
    },
    methods: {
        async fetchScreeningsWithMovieTitle() {
            const response = await this.$http.get(`/api/screenings`);
            const screenings = response.data;

            const moviePromises = screenings.map(async screening => {
                const movieResponse = await this.$http.get(`/api/movies?id=${screening.id_movie}`);
                let movie_title = movieResponse.data[0].title;

                return {...screening, movie_title: movie_title}; 
            });

            const screeningsWithMovieTitle = await Promise.all(moviePromises);

            console.log("Pobrane seanse z tytułami filmów:", screeningsWithMovieTitle);
            return screeningsWithMovieTitle;
        },
        formatDateTime(dateStr, timeStr) {
            let date = new Date(dateStr);

            let time = timeStr.split(':').map(Number);

            date.setHours(time[0], time[1], time[2]);

            let year = date.getFullYear();
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let day = String(date.getDate()).padStart(2, '0');
            let hour = String(date.getHours()).padStart(2, '0');
            let minute = String(date.getMinutes()).padStart(2, '0');
            let second = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        },
        formatCurrency(value) {
            if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
        },
        openNew() {
            this.product = {};
            this.submitted = false;
            this.fetchCinemas().then((data) => (this.cinemas = data));
            this.screeningDialog = true;
        },
        editScreening(screening) {
            this.screening = {...screening};
            this.screeningDialog = true;
        },
        confirmDeleteScreening(screening) {
            this.screening = screening;
            this.deleteScreeningDialog = true;
        },
        async deleteScreening() {
            try {
                console.log("Usunięto seans: ", this.screening);
                await axiosInstance.delete(
                    `/api/panel/screenings/${this.screening.id_screening}`
                );
                this.$toast.add({
                    severity: "info",
                    summary: "Pomyślnie usunięto seans",
                    detail: "",
                    life: 2000,
                });
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Błąd przy usuwaniu seansu",
                    detail: "",
                    life: 2000,
                });
            }
            this.fetchScreeningsWithMovieTitle().then((data) => (this.screenings = data));
            this.deleteScreeningDialog = false;
        },
        findIndexById(id) {
            let index = -1;
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id === id) {
                    index = i;
                    break;
                }
            }

            return index;
        },
        confirmDeleteSelected() {
            this.deleteProductsDialog = true;
        },
        initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            }
        }
    }
}
</script>
<style scoped>
.table-icon{
    margin: 0.2rem;
}
</style>