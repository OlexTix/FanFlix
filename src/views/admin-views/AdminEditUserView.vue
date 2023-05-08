<template>
    <div class="justify-content-center" id="edit">
      <div class="content-container">
        <div class="form-container">
          <h2 class="title">Edytuj użytkownika</h2>
          <hr class="divider" />
          <div class="card">
            <div class="field-row">
              <div class="field" style="margin-right: 1vh;">
                <label for="email" class="input-label">E-MAIL</label>
                <InputText v-model="user.email" id="emailinput" :class="{ 'p-invalid': errorMessage }" />
                <small class="p-error">{{ errorMessageemail }}</small>
              </div>
            </div>
            <div class="field-row">
              <div class="field" style="margin-right: 1vh;">
                <label for="first_name" class="input-label">IMIĘ</label>
                <InputText v-model="user.first_name" :class="{ 'p-invalid': errorMessage }" />
                <small class="p-error">{{ errorMessagefirst_name }}</small>
              </div>
              <div class="field">
                <label for="last_name" class="input-label">NAZWISKO</label>
                <InputText v-model="user.last_name" :class="{ 'p-invalid': errorMessage }" />
                <small class="p-error">{{ errorMessagelast_name }}</small>
              </div>
            </div>
            <div class="field">
              <label for="phone" class="input-label">NUMER TELEFONU</label>
              <InputText v-model="user.phone" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagephone }}</small>
            </div>
            <div class="field">
              <label for="birth_date" class="input-label">DATA URODZENIA</label>
              <Calendar name="birth_date" v-model="user.birth_date" dateFormat="yy-mm-dd"
                :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagebirth_date }}</small>
            </div>
            <div class="card flex justify-content-center">
              <Button label="ZAPISZ ZMIANY" type="submit" severity="primary" rounded id="submitbutton"
                @click="updateUser" />
                <Button label="POWRÓT DO LISTY UŻYTKOWNIKÓW" type="submit" severity="primary" rounded id="submitbutton"
                @click="goBackToList" />
              <small class="p-error">{{ errorMessage }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
import axiosInstance from '../../service/apiService'
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
  export default {
    name: 'AdminEditUserView',
  components: {
    Button,
    Calendar,
    Checkbox
  },
    
    data() {
      return {
        user: {},
      }
    },
    beforeRouteEnter(to, from, next) {
    const id_user = to.params.id_user;
    axiosInstance.get(`/api/users/${id_user}`).then((response) => {
      next((vm) => {
        vm.user = response.data;
      });
    });
  },
   
    methods: {
        async updateUser() {
      try {
        await axiosInstance.put(`/api/users/${this.user.id_user}`, this.user);
        this.$router.push({ name: 'admin-panel/users' });
      } catch (error) {
        console.error(error);
      }
    },
      goBackToList() {
        this.$router.push('/admin-panel/users')
      }
    }
  }
  </script>
  
  <style scoped>
  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  #edit {
  background-color: #1e1e1e;
  border-radius: 20px;
  box-shadow: 0 0 50px 1px rgba(0, 0, 0, 0.25);
  margin-top: 2vh;
  margin-bottom: 2vh;
  padding: 5vh;
  justify-content: center;
  align-items: center;
  display: flex;
  max-width: 500px;
}

#submitbutton {
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

#submitbutton:hover {
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
  