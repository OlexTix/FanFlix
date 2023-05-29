<template>
  <div class="justify-content-center" id="reset">
    <div class="content-container">
      <div class="form-container">
        <h2 class="title">Zresetuj hasło użytkownika</h2>
        <hr class="divider" />
        <div class="card">
          <div class="field">
            <label for="email" class="input-label">E-MAIL</label>
            <InputText type="email" v-model="user[0].email" required :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessageemail }}</small>
          </div>
          <div class="field">
            <label for="password" class="input-label">STARE HASŁO</label>
            <InputText type="password" v-model="oldPassword" required :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessageoldPassword }}</small>
          </div>
          <div class="field">
            <label for="password" class="input-label">NOWE HASŁO</label>
            <InputText type="password" v-model="newPassword" required :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessagenewPassword }}</small>
          </div>
          <div class="card flex justify-content-center">
            <Button label="ZMIEŃ HASŁO" type="submit" severity="primary" rounded id="submitbutton"
              @click="updateUserPass" />
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
import axiosInstance from '../../service/apiService';
import Button from 'primevue/button';

export default {
  name: 'AdminResetUserPasswordView',
  components: {
    Button,
  },
  data() {
    return {
      user: [{}],
      email: '',
      oldPassword: '',
      newPassword: '',
      errorMessage: '',
      errorMessageemail: '',
      errorMessageoldPassword: '',
      errorMessagenewPassword: '',
      id_user: null,
      isFormModified: false,
      isFormValid: true,
    };
  },
  methods: {
    validate() {
      this.errorMessageemail = '';
      this.errorMessageoldPassword = '';
      this.errorMessagenewPassword = '';

      this.validateEmail();
      this.validateOldPassword();
      this.validateNewPassword();
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

    validateOldPassword() {
      if (this.oldPassword.length === 0) {
        this.errorMessageoldPassword = 'Pole Stare hasło jest wymagane';
      } else {
        this.errorMessageoldPassword = '';
      }
    },

    validateNewPassword() {
      if (this.newPassword.length === 0) {
        this.errorMessagenewPassword = 'Pole Nowe hasło jest wymagane';
      } else {
        this.errorMessagenewPassword = '';
      }
    },
    validatePasswordMatch() {
      if (this.oldPassword === this.newPassword) {
        this.errorMessagenewPassword = 'Nowe hasło nie może być takie samo jak stare hasło';
        this.isFormValid = false;
      } else {
        this.errorMessagenewPassword = '';
        this.isFormValid = true;
      }
    },

    async updateUserPass() {
      this.validate();

      if (
        this.errorMessageemail ||
        this.errorMessageoldPassword ||
        this.errorMessagenewPassword
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
          detail: 'Brak nowego hasła. Wpisz hasło inne niż stare.',
          life: 3000
        });
        return;
      }

      try {
        const response = await axiosInstance.put(`/api/users/${this.id_user}/reset`, {
          email: this.user[0].email,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });

        console.log(response.data.message);

        this.$toast.add({
          severity: 'success',
          summary: 'Pomyślnie zmieniono hasło użytkownika',
          detail: '',
          life: 3000
        });
        this.errorMessage='';
      } catch (error) {
        console.error(error);
        this.errorMessage = error;
        this.$toast.add({
          severity: 'error',
          summary: 'Błąd zmiany hasła',
          detail: '',
          life: 3000
        });
      }
    },

    goBackToList() {
      this.$router.push('/admin-panel/users');
    }
  },

  watch: {
    email() {
      this.isFormModified = true;
      this.validateEmail();
    },

    oldPassword() {
      this.isFormModified = true;
      this.validateOldPassword();
      this.validatePasswordMatch();
    },

    newPassword() {
      this.isFormModified = true;
      this.validateNewPassword();
      this.validatePasswordMatch();
    }
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.id_user = to.params.id_user;
      axiosInstance.get(`/api/panel/users/?id_user=${vm.id_user}`).then((response) => {
        vm.user = response.data;
      });
    });
  }
};
</script>
  
<style scoped>
label {
  display: block;
  margin-bottom: 0.5rem;
}

#reset {
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
  