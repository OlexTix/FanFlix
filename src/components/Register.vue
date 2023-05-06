<template>
  <div class="justify-content-center" id="register">
    <div class="content-container">
      <div class="form-container">
        <h2 class="title">Zarejestruj się</h2>
        <hr class="divider" />
        <div class="card">
          <div class="field-row">
            <div class="field" style="margin-right: 1vh;">
              <label for="email" class="input-label">E-MAIL</label>
              <InputText v-model="email" id="emailinput" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessageemail }}</small>
            </div>
            <div class="field">
              <label for="confirmemail" id="confirmemailinput" class="input-label">POTWIERDŹ ADRES E-MAIL</label>
              <InputText v-model="confirmemail" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessageconfirmemail }}</small>
            </div>
          </div>
          <div class="field-row">
            <div class="field" style="margin-right: 1vh;">
              <label for="first_name" class="input-label">IMIĘ</label>
              <InputText v-model="first_name" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagefirst_name }}</small>
            </div>
            <div class="field">
              <label for="last_name" class="input-label">NAZWISKO</label>
              <InputText v-model="last_name" :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagelast_name }}</small>
            </div>
          </div>
          <div class="field">
            <label for="phone" class="input-label">NUMER TELEFONU</label>
            <InputText v-model="phone" :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessagephone }}</small>
          </div>
          <div class="field">
            <label for="birth_date" class="input-label">DATA URODZENIA</label>
            <Calendar name="birth_date" v-model="birth_date" dateFormat="yy-mm-dd"
              :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessagebirth_date }}</small>
          </div>
          <div class="field">
            <label for="password" class="input-label">HASŁO</label>
            <InputText v-model="password" id="passwordinput" type="password" :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessagepassword }}</small>
          </div>
          <div class="field">
            <label for="confirmpassword" class="input-label">POTWIERDŹ HASŁO</label>
            <InputText v-model="confirmpassword" id="confirmpasswordinput" type="password"
              :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessageconfirmpassword }}</small>
          </div>
          <div class="card flex justify-content-center">
            <Button label="ZAREJESTRUJ SIE" type="submit" severity="primary" rounded id="signupbutton"
              @click="register" />
            <small class="p-error">{{ errorMessage }}</small>
          </div>
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
  name: 'RegisterForm',
  components: {
    Button,
    Calendar,
    Checkbox
  },
  data() {
    return {
      first_name: '',
      last_name: '',
      birth_date: '',
      phone: '',
      email: '',
      confirmemail: '',
      password: '',
      confirmpassword: '',
      errorMessage: '',
      errorMessageemail: '',
      errorMessageconfirmemail: '',
      errorMessagefirst_name: '',
      errorMessagelast_name: '',
      errorMessagephone: '',
      errorMessagebirth_date: '',
      errorMessagepassword: '',
      errorMessageconfirmpassword: '',
    };
  },
  methods: {
    async validate() {
      this.errorMessageemail = '';
      this.errorMessageconfirmemail = '';
      this.errorMessagefirst_name = '';
      this.errorMessagelast_name = '';
      this.errorMessagephone = '';
      this.errorMessagebirth_date = '';
      this.errorMessagepassword = '';
      this.errorMessageconfirmpassword = '';
      if (this.email.length == 0) {
        this.errorMessageemail = "E-mail field is required";
      }
      if (this.confirmemail != this.email) {
        this.errorMessageconfirmemail = "E-mail addresses must match";
      }
      if (this.first_name.length == 0) {
        this.errorMessagefirst_name = "Firstname field is required";
      }
      if (this.last_name.length == 0) {
        this.errorMessagelast_name = "Lastname field is required";
      }
      if (this.phone.length == 0) {
        this.errorMessagephone = "Phone number field is required";
      }
      if (this.birth_date.length == 0) {
        this.errorMessagebirth_date = "Birthdate field is required";
      }
      if (this.password.length < 8) {
        this.errorMessagepassword = "Password field is required (at least 8 characters)";
      }
      if (this.confirmpassword != this.password) {
        this.errorMessageconfirmpassword = "Passwords must match";
      }
    },
    async register() {
      try {
        this.validate();
        const response = await this.$http.post('/api/auth/register', {
          first_name: this.first_name,
          last_name: this.last_name,
          phone: this.phone,
          birth_date: this.birth_date,
          email: this.email,
          password: this.password,
        });

        //TODO
        // Przetwarzaj odpowiedź, na przykład zapisując token JWT
        console.log(response.data);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('first_name', response.data.first_name);
        localStorage.setItem('last_name', response.data.last_name);
        localStorage.setItem('role', response.data.role);

        this.errorMessage = '';

      } catch (error) {
        console.error('Błąd rejestracji:', error);

        if (error.response) {
          switch (error.response.status) {
            case 400:
              this.errorMessage = 'Błąd rejestracji';
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
  },
};
</script>

<style>
#register {
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

#signupbutton {
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
}

#signupbutton:hover {
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
