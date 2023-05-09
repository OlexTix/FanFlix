<template>
    <div class="justify-content-center" id="reset">
      <div class="content-container">
        <div class="form-container">
          <h2 class="title">Zresetuj hasło użytkownika</h2>
          <hr class="divider" />
          <div class="card">
            <div class="field">
              <label for="password" class="input-label">STARE HASŁO</label>
              <InputText v-model="oldPassword" required :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagephone }}</small>
            </div>
            <div class="field">
              <label for="password" class="input-label">NOWE HASŁO</label>
              <InputText v-model="newPassword" required :class="{ 'p-invalid': errorMessage }" />
              <small class="p-error">{{ errorMessagephone }}</small>
            </div>
            <div class="card flex justify-content-center">
              <Button label="ZMIEŃ HASŁO" type="submit" severity="primary" rounded id="submitbutton"
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
  export default {
    name: 'AdminResetUserPasswordView',
  components: {
    Button,
    Checkbox
  },
    
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      errorMessage: "",
    };
  },
  methods: {
    async updateUserPass() {
      try {
        const response = await axios.post("/api/updateUserPass", {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });
        console.log(response.data.message);
      } catch (error) {
        console.error(error);
        this.errorMessage=error;
      }
    },
    goBackToList() {
        this.$router.push('/admin-panel/users')
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
   
  
  }
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
  