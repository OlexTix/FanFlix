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
              <InputText v-model="user[0].email" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessageemail }}</small>
            </div>
          </div>
          <div class="field-row">
            <div class="field" style="margin-right: 1vh;">
              <label for="first_name" class="input-label">IMIĘ</label>
              <InputText v-model="user[0].first_name" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagefirst_name }}</small>
            </div>
            <div class="field">
              <label for="last_name" class="input-label">NAZWISKO</label>
              <InputText v-model="user[0].last_name" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagelast_name }}</small>
            </div>
          </div>

          <div class="field">
            <label for="role" class="input-label">ROLA</label>
            <InputText v-model="user[0].role" :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessagerole }}</small>
          </div>
          <div class="field">
            <label for="is_active" class="input-label">KONTO AKTYWOWANE?</label>
            <Dropdown v-model="user[0].is_active" :options="activeOptions" optionLabel="label" optionValue="value" />
            <small class="p-error">{{ errorMessageis_active }}</small>
          </div>


          <div class="field">
            <label for="phone" class="input-label">NUMER TELEFONU</label>
            <InputText v-model="user[0].phone" :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessagephone }}</small>
          </div>
          <div class="field">
            <label for="birth_date" class="input-label">DATA URODZENIA</label>
            <Calendar name="birth_date" v-model="user[0].birth_date" dateFormat="yy-mm-dd"
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
import Dropdown from 'primevue/dropdown';
export default {
  name: 'AdminEditUserView',
  components: {
    Button,
    Calendar,
    Checkbox,
    Dropdown
  },

  data() {
    return {
      user: [{}],
      errorMessage: '',
      errorMessageemail: '',
      errorMessagefirst_name: '',
      errorMessagelast_name: '',
      errorMessagerole: '',
      errorMessagephone: '',
      errorMessagebirth_date: '',
      errorMessageis_active: '',
      isActivated: '',
      activeOptions: [
        { label: 'Tak', value: "true" },
        { label: 'Nie', value: "false" }
      ],
      isFormValid: true,
      isFormModified: true,


    }
  },
  beforeRouteEnter(to, from, next) {
    const id_user = to.params.id_user;
    axiosInstance.get(`/api/panel/users?id_user=${id_user}`).then((response) => {
      next((vm) => {
        vm.user = response.data;
        vm.user[0].is_active = response.data[0].is_active ? "true" : "false";
        console.log(vm.user);
      });
    });
  },

  methods: {
    validate() {
      this.errorMessageemail = '';
      this.errorMessagefirst_name = '';
      this.errorMessagelast_name = '';
      this.errorMessagephone = '';
      this.errorMessagebirth_date = '';
      this.errorMessagerole = '';

      this.validateEmail();
      this.validateFirstName();
      this.validateLastName();
      this.validatePhone();
      this.validateBirthDate();
      this.validateRole();
    },
    validateEmail() {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (this.user[0].email.length === 0) {
        this.errorMessageemail = 'Pole E-mail jest wymagane';
      } else if (!regex.test(this.user[0].email)) {
        this.errorMessageemail = 'Niepoprawny adres e-mail';
      } else {
        this.errorMessageemail = '';
      }
    },

    validateFirstName() {
      if (this.user[0].first_name.length === 0) {
        this.errorMessagefirst_name = 'Pole Imię jest wymagane';
      } else {
        this.errorMessagefirst_name = '';
      }
    },

    validateLastName() {
      if (this.user[0].last_name.length === 0) {
        this.errorMessagelast_name = 'Pole Nazwisko jest wymagane';
      } else {
        this.errorMessagelast_name = '';
      }
    },

    validatePhone() {
      const regex = /^\d{3}-\d{3}-\d{3}$/;
      if (this.user[0].phone.length === 0) {
        this.errorMessagephone = 'Pole numer telefonu jest wymagane';
      } else if (!regex.test(this.user[0].phone)) {
        this.errorMessagephone = 'Nieprawidłowy format numeru telefonu (xxx-xxx-xxx)';
      } else {
        this.errorMessagephone = '';
      }
    },

    validateBirthDate() {
      if (this.user[0].birth_date.length === 0) {
        this.errorMessagebirth_date = 'Pole data urodzenia jest wymagane';
        this.isFormValid = false;
      } else {
        this.errorMessagebirth_date = '';
        this.isFormValid = true;
      }
    },
    validateRole() {
      if (this.user[0].role.length === 0) {
        this.errorMessagerole = 'Pole Rola jest wymagane';
      } else {
        this.errorMessagerole = '';
      }
    },
    async updateUser() {
      this.validate();

      if (
        this.errorMessageemail ||
        this.errorMessagefirst_name ||
        this.errorMessagelast_name ||
        this.errorMessagephone ||
        this.errorMessagebirth_date ||
        this.errorMessagerole
      ) {
        this.$toast.add({
          severity: 'error',
          summary: 'Błędy w formularzu',
          detail: 'Proszę poprawić błędy w formularzu',
          life: 3000
        });
        return;
      }
      if (!this.isFormModified || !this.isFormValid) {
        this.$toast.add({
          severity: 'info',
          summary: 'Brak zmian',
          detail: 'Brak wprowadzonych zmian w polach. Wprowadź zmiany, aby dokonać aktualizacji użytkownika.',
          life: 3000
        });
        return;
      }

      try {
        const userWithoutIdandReg = { ...this.user[0] };
        delete userWithoutIdandReg.id_user;
        delete userWithoutIdandReg.last_login;
        delete userWithoutIdandReg.registration_date;
        await axiosInstance.put(`/api/panel/users/${this.user[0].id_user}`, userWithoutIdandReg);
        this.$toast.add({
          severity: 'success',
          summary: 'Pomyślnie zmieniono dane użytkownika',
          detail: '',
          life: 3000
        });
        this.errorMessage='';
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: 'error',
          summary: 'Błąd przy aktualizacji danych użytkownika',
          detail: '',
          life: 3000
        });
      }
    },
    goBackToList() {
      this.$router.go(-1);
    },
    watch: {
      email() {
        this.isFormModified = true;
        this.validateEmail();
      },

      firstName() {
        this.isFormModified = true;
        this.validateFirstName();
      },

      lastName() {
        this.isFormModified = true;
        this.validateLastName();
      },
      role() {
        this.isFormModified = true;
        this.validateRole();
      },
      phone() {
        this.isFormModified = true;
        this.validatePhone();
      },
      birth_date() {
        this.isFormModified = true;
        this.validateBirthDate();
      },
    },
  }
}
</script>
  
<style scoped>
label {
  display: block;
  margin-bottom: 0.5rem;
}

#edit {
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
  