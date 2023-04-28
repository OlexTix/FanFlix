<template>
    <div class="card-container">
      <div class="content-container">
        <div class="form-container">
          <h2 class="title">Zaloguj się</h2>
          <hr class="divider" />
          <div class="input-container">
            <label for="email" class="input-label">E-MAIL</label>
            <InputText class="input-email-field" type="text" v-model="email" />
          </div>
          <div class="input-container">
            <label for="password" class="input-label">HASŁO</label>
            <Password class="input-password-field" v-model="password" :feedback="false" />
          </div>
          <Button class="login-button" @click="login">LOGOWANIE</Button>
          <p class="error-message">{{ errorMessage }}</p>
          <p class="forgot-password">Zapomniałeś hasła?</p>
          <p class="register">
            Nie masz jeszcze konta? <router-link to="/sign-up" class="register-link">Rejestracja</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Button from 'primevue/button';
  import axios from 'axios';
  export default {
    name: 'LoginForm',
    components: {
        Button,
    },
    data() {
        return {
        email: '',
        password: '',
        errorMessage: ''
        };
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('/api/auth/login', {
                    email: this.email,
                    password: this.password,
                });

                //TODO
                // Przetwarzaj odpowiedź, na przykład zapisując token JWT
                console.log(response.data);

                this.errorMessage='';

            } catch (error) {
                console.error('Błąd logowania:', error);

                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                        this.errorMessage = 'Nieprawidłowe hasło';
                        break;
                        case 404:
                        this.errorMessage = 'Użytkownik nie znaleziony';
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
  
  <style scoped>
  .card-container {
    background-color: #1e1e1e;
    width: 536px;
    height: 687px;
    border-radius: 20px;
    box-shadow: 0 0 50px 1px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
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
  
  .title {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .divider {
    width: 100%;
    height: 1px;
    background-color: #ffffff;
    margin-bottom: 20px;
  }
  
  .input-container {
    display: flex;
    flex-direction: column;
    
    width: 100%;
    margin-bottom: 20px;
  }
  
  .input-label {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .input-password-field {
    width: 100%;
    height: 40px;
  }

  .input-email-field {
    width: 100%;
    height: 40px;
  }
  
  .login-button {
    width: 250px;
    height: 40px;
    border-radius: 6px;
    background-image: linear-gradient(to bottom, #00a877, #007d59);
    border-color: #007d59;
    font-weight: 500;
    font-size: 18px;
    color: #ffffff;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    cursor: pointer;
  }

  .login-button:hover {
    background-image: linear-gradient(to bottom, #008660, #005a41);
    border-color: #005f44;
  }
  
  .forgot-password {
    color: #00a877;
    font-weight: 500;
    font-size: 18px;
    margin-top: 115px;
  }
  
  .register {
    color: #ffffff;
    font-weight: 500;
    font-size: 18px;
    margin-top: 20px;
  }
  
  .register-link {
    color: #00a877;
  }

  .error-message {
    color: red;
    font-weight: bold;
    margin-top: 10px;
  }
  </style>