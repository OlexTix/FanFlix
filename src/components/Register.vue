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

  // Watchers for each input field
  this.$watch('email', () => { this.validateEmail(); });
  this.$watch('confirmemail', () => { this.validateConfirmEmail(); });
  this.$watch('first_name', () => { this.validateFirstName(); });
  this.$watch('last_name', () => { this.validateLastName(); });
  this.$watch('phone', () => { this.validatePhone(); });
  this.$watch('birth_date', () => { this.validateBirthDate(); });
  this.$watch('password', () => { this.validatePassword(); });
  this.$watch('confirmpassword', () => { this.validateConfirmPassword(); });

  // Initial validation
  this.validateEmail();
  this.validateConfirmEmail();
  this.validateFirstName();
  this.validateLastName();
  this.validatePhone();
  this.validateBirthDate();
  this.validatePassword();
  this.validateConfirmPassword();
},

validateEmail() {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (this.email.length === 0) {
    this.errorMessageemail = "Pole E-mail jest wymagane";
  } else if (!regex.test(this.email)) {
    this.errorMessageemail = "Niepoprawny adres e-mail";
  } else {
    this.errorMessageemail = '';
  }
},

validateConfirmEmail() {
  if (this.confirmemail !== this.email) {
    this.errorMessageconfirmemail = "Adresy e-mail muszą być zgodne";
  } else {
    this.errorMessageconfirmemail = '';
  }
},

validateFirstName() {
  if (this.first_name.length === 0) {
    this.errorMessagefirst_name = "Pole Imię jest wymagane";
  } else {
    this.errorMessagefirst_name = '';
  }
},

validateLastName() {
  if (this.last_name.length === 0) {
    this.errorMessagelast_name = "Pole Nazwisko jest wymagane";
  } else {
    this.errorMessagelast_name = '';
  }
},

validateBirthDate() {
  if (this.birth_date.length === 0) {
    this.errorMessagebirth_date = "Pole data urodzenia jest wymagane";
  } else {
    this.errorMessagebirth_date = '';
  }
},

validatePhone() {
  const regex = /^\d{3}-\d{3}-\d{3}$/;
  if (this.phone.length === 0) {
    this.errorMessagephone = "Pole numer telefonu jest wymagane";
  } else if (!regex.test(this.phone)) {
    this.errorMessagephone = "Nieprawidłowy format numeru telefonu (xxx-xxx-xxx)";
  } else {
    this.errorMessagephone = '';
  }
},

validatePassword() {
  if (this.password.length < 8) {
    this.errorMessagepassword = "Pole Hasło jest wymagane (co najmniej 8 znaków)";
  } else {
    this.errorMessagepassword = '';
  }
},

validateConfirmPassword() {
  if (this.confirmpassword !== this.password) {
    this.errorMessageconfirmpassword = "Hasła muszą być zgodne";
  } else {
    this.errorMessageconfirmpassword = '';
  }
},
async register() {
  this.validate();
  // Check for any validation errors
  if (this.errorMessageemail || this.errorMessageconfirmemail || this.errorMessagefirst_name ||
      this.errorMessagelast_name || this.errorMessagephone || this.errorMessagebirth_date ||
      this.errorMessagepassword || this.errorMessageconfirmpassword) {
    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Błędy w formularzu. Proszę je poprawić', life: 3000 });
    return;
  }
  try {
    const response = await this.$http.post('/api/auth/register', {
      first_name: this.first_name,
      last_name: this.last_name,
      phone: this.phone,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
    });

    console.log(response.data);
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('email', response.data.email);
    localStorage.setItem('first_name', response.data.first_name);
    localStorage.setItem('last_name', response.data.last_name);
    localStorage.setItem('role', response.data.role);

    this.errorMessage = '';

    if (response.status === 200) {
      const $toastLife = 3000;
      this.$toast.add({ severity: 'info', summary: 'Info', detail: `Zarejestrowano użytkownika. Możesz się zalogować`, life: $toastLife });
      await new Promise(resolve => setTimeout(resolve, $toastLife));
      this.$router.push('/');
    }

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
