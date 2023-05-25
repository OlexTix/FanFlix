<template>
    <AdminPanelTemplate>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <div class="users-table">
        <div class="table-tab">
          <h1 class="table-title">EMPLOYEES</h1>
        </div>
        <DataTable
          :value="fetchedUsers"
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
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success" @click="editUser(slotProps.data.id_user)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteUser(slotProps.data.id_user)" />
                <Button icon="pi pi-key" class="p-button-rounded p-button-info" @click="changeUserPassword(slotProps.data.id_user)" />
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
          users: [],
          filteredusers:[],
            roleEmployee: 'employee',
          errorMessage: "",
          columns: [
            { field: "id_user", header: "ID", editable: false, sortable: true },
            { field: "first_name", header: "Imię", editable: true, sortable: true },
            { field: "last_name", header: "Nazwisko", editable: true, sortable: true },
            { field: "email", header: "Email", editable: true, sortable: true },
            { field: "role", header: "Rola", editable: true, sortable: true },
            { field: "phone", header: "Numer telefonu", editable: true, sortable: true },
            { field: "birth_date", header: "Data urodzenia", editable: true, sortable: true },
            { field: "last_login", header: "Ostatnie logowanie", editable: false, sortable: true },
            { field: "registration_date", header: "Data rejestracji", editable: false, sortable: true },
            { field: "is_active", header: "Konto aktywowane?", editable: true, sortable: true },
          ],
          sortField: null,
          sortOrder: null,
        };
      },
      computed: {
      fetchedUsers() {
        return this.filteredusers;
      },
    },
    beforeMount() {
      this.fetchUsers();
    },
      methods: {
        async fetchUsers() {
          try {
            const response = await axiosInstance.get("/api/panel/users");
            this.users = response.data;
            this.filteredusers = this.users.filter(user => user.role === this.roleEmployee);
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
      await axiosInstance.put(`/api/panel/users/${data.id_user}`, {
        [field]: newValue,
      });
      this.$toast.add({
        severity: "info",
        summary: "Pomyślnie zaktualizowano pracownika",
        detail: "",
        life: 3000,
      });
      await this.fetchUsers(); // Aktualizacja danych po zapisaniu zmian
    } catch (error) {
      console.error(error);
      this.$toast.add({
        severity: "error",
        summary: "Błąd przy aktualizacji pracownika",
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
            const response = await axiosInstance.get("/api/panel/users", {
              params: { sortField, sortOrder },
            });
            this.users = response.data;
            this.filteredusers = this.users.filter(user => user.role === this.roleEmployee);
          } catch (error) {
            console.error(error);
          }
        },
        editUser(id_user) {
          this.$router.push({ name: "edit-user", params: { id_user: id_user } });
        },
        changeUserPassword(id_user) {
          this.$router.push({ name: "reset-password", params: { id_user: id_user } });
        },
        async deleteUser(userId) {
          try {
            await axiosInstance.delete(`/api/panel/users/${userId}`);
            await this.fetchUsers();
            this.$toast.add({
              severity: "info",
              summary: "Pomyślnie usunięto pracownika",
              detail: "",
              life: 3000,
            });
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Błąd przy usuwaniu pracownika",
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
  
  .users-table {
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
      font-weight: 400;
      text-align: center;
      vertical-align: center;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  @media screen and (max-width: 768px) {
    .users-table {
      overflow-x: auto;
    }
  }
  
  </style>