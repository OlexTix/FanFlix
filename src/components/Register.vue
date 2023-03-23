<template>
    <div class="flex justify-content-center" id="register">
        <h1>Sign Up</h1>
        <div class="card">
            <div class="field">
                <InputText id="name-register" v-model="name" type="text" placeholder="Name" autofocus />
            </div>
            <div class="field">
                <InputText id="lastname-register" v-model="lastname" type="text" placeholder="Lastname" autofocus />
            </div>
            <div class="field">
                <div class="p-input-icon-right">
                    <i class="pi pi-envelope" />
                    <InputText id="email-register" v-model="email" type="email" placeholder="Email" />
                </div>
            </div>
            <div class="field">
                <div class="p-float-label">
                    <Password v-model="password">
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
            <div class="field">
                <InputText id="input" v-model="confirmpassword" type="password" placeholder="Confirm Password" autofocus />
            </div>
            <div class="field-checkbox">
                <label for="accept">I agree to the terms and conditions*</label>
            </div>
        </div>
    </div>
</template>
<style>
#register> .card >.field
{
    margin-top: 1.3vh;
}
</style>
<script setup>
import { ref } from "vue";


const name = ref();
const email = ref();
const password = ref();
const accept = ref();
</script>
