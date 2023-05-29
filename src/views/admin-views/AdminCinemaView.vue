<template>
    <AdminPanelTemplate>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <div class="cinemas-table">
        <div class="table-tab">
          <h1 class="table-title">KINA</h1>
        </div>
        <DataTable
          :value="fetchedCinemas"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          editMode="cell"
          sortMode="multiple"
          @cell-edit-complete="onCellEditComplete"
          tableClass="editable-cells-table"
          tableStyle="min-width: 50rem"
          :sortField="sortField"
          :sortOrder="sortOrder"
          @sort-change="onSortChange"
        >
            <Column
              v-for="col of columns"
              :key="col.field"
              :field="col.field"
              :header="col.header"
              :editable="col.editable"
              :sortable="col.sortable"
            >
              <template #body="{ data, field }">
                {{ data[field] }}
              </template>
              <template #editor="{ data, field }">
                <InputText v-model="data[field]" autofocus />
              </template>
            </Column>
            <Column>
              <template #header="slotProps">
                Akcje
              </template>
              <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success" @click="editCinema(slotProps.data.id_cinema)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteCinema(slotProps.data.id_cinema)" />
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
    import "primevue/resources/themes/saga-blue/theme.css";
    import "primevue/resources/primevue.min.css";
    
    export default {
      components: {
        AdminPanelTemplate,
        DataTable,
        Column,
        InputText,
        Button,
      },
      data() {
        return {
         cinemas: [],
          errorMessage: "",
          columns: [
            { field: "id_cinema", header: "ID", editable: false, sortable: true },
            { field: "name", header: "Nazwa", editable: true, sortable: true },
            { field: "id_address", header: "ID adresy", editable: true, sortable: true },
            { field: "phone", header: "Telefon", editable: true, sortable: true },
            { field: "street", header: "Ulica", editable: true, sortable: true },
            { field: "building_number", header: "Numer budynku", editable: true, sortable: true },
            { field: "apartment_number", header: "Numer lokalu", editable: true, sortable: true },
            { field: "postal_code", header: "Kod pocztowy", editable: false, sortable: true },
            { field: "city", header: "Miasto", editable: false, sortable: true },
            { field: "country", header: "Kraj", editable: true, sortable: true },
          ],
          sortField: null,
          sortOrder: null,
        };
      },
      computed: {
      fetchedCinemas() {
        return this.cinemas
      },
    },
    beforeMount() {
      this.fetchCinemas();
    },
      methods: {
        async fetchCinemas() {
          try {
            const response = await axiosInstance.get("/api/panel/cinemas");
            this.cinemas = response.data;
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
      await axiosInstance.put(`/api/panel/cinemas/${data.id_cinema}`, {
        [field]: newValue,
      });
      this.$toast.add({
        severity: "info",
        summary: "Pomyślnie zaktualizowano kino",
        detail: "",
        life: 3000,
      });
      await this.fetchCinemas(); // Aktualizacja danych po zapisaniu zmian
    } catch (error) {
      console.error(error);
      this.$toast.add({
        severity: "error",
        summary: "Błąd przy aktualizacji kina",
        detail: "",
        life: 3000,
      });
    }
  },
  
        async onSortChange(event) {
          const { sortField, sortOrder } = event;
          this.sortField = sortField;
          this.sortOrder = sortOrder;
    
          try {
            const response = await axiosInstance.get("/api/panel/cinemas", {
              params: { sortField, sortOrder },
            });
            this.cinema= response.data;
          } catch (error) {
            console.error(error);
          }
        },
        editCinema(id_cinema) {
          this.$router.push({ name: "edit-cinema", params: { id_cinema: id_cinema} });
        },
        async deleteCinema(id_cinema) {
          try {
            await axiosInstance.delete(`/api/panel/cinemas/${id_cinema}`);
            await this.fetchCinemas();
            this.$toast.add({
              severity: "info",
              summary: "Pomyślnie usunięto kino",
              detail: "",
              life: 3000,
            });
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Błąd przy usuwaniu kina",
              detail: "",
              life: 3000,
            });
          }
        },
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
  
  .cinemas-table {
      box-shadow: 0 0 50px 1px rgba(0, 0, 0, 0.25);
  }
  
  .cell
  {
      background-color: #333;
      color: #fff;
  }
  
  .p-editable-column
  {
      background-color: #333;
      color: #fff;
  }
  .p-datatable .p-datatable-thead>tr>th {
      background-color: #333;
      color: #fff;
  }
  
  .p-paginator.p-component
  {
      background-color: #333;
      color: #fff;
  }
  td  {
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
    .cinemas-table {
      overflow-x: auto;
    }
  }
  
  </style>