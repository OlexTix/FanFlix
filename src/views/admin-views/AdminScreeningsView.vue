<template>
    <AdminPanelTemplate>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <div class="screenings-table">
            <div class="table-tab">
                <h1 class="table-title">REPERTUAR</h1>
            </div>
            <DataTable :value="screenings" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" sortMode="multiple"
                removableSort class="custom-datatable">
                <Column field="id_screening" class="custom-header" sortable header="ID"></Column>
                <Column field="id_movie" class="custom-header" sortable header="Film"></Column>
                <Column field="id_cinema_hall" class="custom-header" sortable header="Sala kinowa"></Column>
                <Column field="id_screening_type" class="custom-header" sortable header="Typ"></Column>
                <Column field="language" class="custom-header" sortable header="Język"></Column>
                <Column field="subtitle" class="custom-header" sortable header="Nazwa"></Column>
                <Column field="city" class="custom-header" sortable header="Miejscowość"></Column>
                <Column field="date" class="custom-header" sortable header="Data"></Column>
                <Column field="time" class="custom-header" sortable header="Czas"></Column>
                <Column class="custom-header">
                    <template #body="rowData">
                        <div class="action-buttons">
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </AdminPanelTemplate>
</template>
  
<script>
import axiosInstance from '../../service/apiService.js';
import AdminPanelTemplate from '../../components/templates/AdminPanelTemplate.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

export default {
    components: {
        AdminPanelTemplate,
        DataTable,
        Column,
        Button
    },
    data() {
        return {
            screenings: [],
            errorMessage: ''
        };
    },
    async created() {
        try {
            const response = await axiosInstance.get('/api/screenings');
            this.screenings = response.data;
        } catch (error) {
            console.error(error);
        }
    },
   
};
</script>
<style>
.custom-datatable {
    background-color: #2C2B2B;
    border: 3px solid #007d59;
}

.custom-datatable thead {
    background-color: #2C2B2B;
}

.custom-datatable .p-paginator {
    background-color: #333333;
}


.custom-header {
    color: #2C2B2B;
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

.screenings-table {
    box-shadow: 0 0 50px 1px rgba(0, 0, 0, 0.25);
}

.p-datatable .p-datatable-thead>tr>th {
    background-color: #333;
    color: #fff;
}

.p-button {
    background-color: transparent;
    border: none;
}

.p-datatable .p-datatable-thead>tr>th>span {
    font-weight: 800;
}

.table-title {
    font-weight: 600;
    color: white;
    text-align: center;
    vertical-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.custom-header {
    background-color: #2C2B2B;
    color: white;
    font-weight: 300;
}

.action-buttons {
    display: flex;
    justify-content: space-between;
    margin: auto;
}

.delete-button {
    border-radius: 6px;
    background-image: linear-gradient(to bottom, #a80000, #5b0101);
    border-color: #650a0a;
    font-weight: 600;
    font-size: 15px;
    margin-right: 1.2vh;
    color: #ffffff;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.delete-button:hover {
    background-image: linear-gradient(to bottom, #420505, #550404);
    border-color: #4a0707;
}

.edit-button {
    border-radius: 6px;
    background-image: linear-gradient(to bottom, #00a877, #007d59);
    border-color: #007d59;
    font-weight: 600;
    font-size: 15px;
    color: #ffffff;
    margin-right: 1.2vh;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.edit-button:hover {
    background-image: linear-gradient(to bottom, #008660, #005a41);
    border-color: #005f44;
}

.password-button {
    border-radius: 6px;
    background-image: linear-gradient(to bottom, #a89200, #5b4801);
    border-color: #65560a;
    font-weight: 600;
    font-size: 15px;
    color: #ffffff;
    margin-right: 1.2vh;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.password-button:hover {
    background-image: linear-gradient(to bottom, #423905, #554304);
    border-color: #4a3b07;
}
</style>