<template>
    <div class="card">
        <DataTable 
            editMode="row"
            v-model:editingRows="screenings"
            @row-edit-save=""
            v-model:filters="filters" 
            :value="screenings" 
            paginator 
            showGridlines 
            :rows="5" 
            dataKey="id_screening"
            filterDisplay="menu" 
            :loading="loading" 
            :globalFilterFields="['name', 'city', 'date', 'time']">
            <Column field="name" header="Cinema Name"></Column>
            <Column field="city" header="City"></Column>
            <Column field="date" header="Date" filter filterField="date" dataType="date">
                <template #body="{ data }">
                    {{ formatDate(data.date) }}
                </template>
                <template #filter="{ filters }">
                    <Calendar v-model="filters.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
                </template>
            </Column>
            <Column field="time" header="Time"></Column>
        </DataTable>
    </div>
</template>

<script>
import axiosInstance from '../../../service/apiService';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import Calendar from 'primevue/calendar';

export default {
    components: {
        Calendar,
    },
    data() {
        return {
            screenings: [],
            errorMessage: '',
            customers: null,
            filters: null,
            representatives: [
                { name: 'Amy Elsner', image: 'amyelsner.png' },
                { name: 'Anna Fali', image: 'annafali.png' },
                { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
                { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
                { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
                { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
                { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
                { name: 'Onyama Limba', image: 'onyamalimba.png' },
                { name: 'Stephen Shaw', image: 'stephenshaw.png' },
                { name: 'XuXue Feng', image: 'xuxuefeng.png' }
            ],
            statuses: ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'],
            loading: true
        };
    },
    created() {
        this.initFilters();
    },
    async mounted() {
        try {
            const response = await axiosInstance.get('/api/screenings');
            console.log("Pobrane seanse:", response.data);
            this.screenings = response.data;
            this.loading = false;
        } catch (error) {
            this.loading = false; 
            console.error(error);
            this.errorMessage = error.message || 'An error occurred';  
        }
    },
    methods: {
        formatDate(value) {
            let date = new Date(value);
            return date.toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
        formatCurrency(value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        },
        clearFilter() {
            this.initFilters();
        },
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                city: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                date: { value: null, matchMode: FilterMatchMode.DATE_IS },
                time: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            };
        },
        getCustomers(data) {
            return [...(data || [])].map((d) => {
                d.date = new Date(d.date);

                return d;
            });
        },
        getSeverity(status) {
            switch (status) {
                case 'unqualified':
                    return 'danger';

                case 'qualified':
                    return 'success';

                case 'new':
                    return 'info';

                case 'negotiation':
                    return 'warning';

                case 'renewal':
                    return null;
            }
        }
    }
};
</script>