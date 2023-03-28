<template>
    <div class="flex justify-content-center" id="login">
        <h1>Log In</h1>
        <div class="card">
            <div class="field">
                <InputText id="name-login" v-model="name" type="text" placeholder="Name" autofocus />
            </div>
            <div class="field">
                <div class="p-input-icon-right">
                    <i class="pi pi-envelope" />
                    <InputText id="email-login" v-model="email" type="email" placeholder="Email" />
                </div>
            </div>
            <div class="field">
                <div class="p-float-label">
                    <Password v-model="password" :feedback="false" toggleMask>
                        <template #header>
                            <h6>Pick a password</h6>
                        </template>
                        <template #footer>
                            <p class="mt-2">Suggestions</p>
                            <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                <li>At least one lowercase</li>
                                <li>At least one uppercase</li>
                                <li>At least one numeric</li>
                                <li>Minimum 8 characters</li>
                            </ul>
                        </template>
                    </Password>
                    <label for="password">Password</label>
                </div>
            </div>
    
                <div class="card flex justify-content-center">
        <Button label="Log in" />
    </div>
                
            </div>
        </div>
</template>
<style>
#login
{
    margin-left: 3vh;
}

#login>.card>.card.flex.justify-content-center {
    margin-top: 1.3vh;
}


#login> .card >.field
{
margin-top: 1.3vh;
}

#login> form> .card>.card.flex.justify-content-center{
    margin-top: 1.3vh;
}
</style>
<script setup>
import { ref } from "vue";
import Button from 'primevue/button';

const name = ref();
const email = ref();
const password = ref();
const accept = ref();
</script>
