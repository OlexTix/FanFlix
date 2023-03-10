<template>
        <div class="card flex justify-content-center">
        <Rating v-model="value">
            <template #cancelicon>
                <img src="https://primefaces.org/cdn/primevue/images/rating/cancel.png" height="24" width="24" />
            </template>
            <template #onicon>
                <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24" width="24" />
            </template>
            <template #officon>
                <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24" width="24" />
            </template>
        </Rating>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: null
        }
    }
};
</script>