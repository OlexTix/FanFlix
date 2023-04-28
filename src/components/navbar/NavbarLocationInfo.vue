<template>
    <div style="margin-left: auto;">
        <RouterLink to="#" id="cinemainfo">
            <fa-icon icon="fa-map-marker-alt" style="margin-right: 10px; font-size: 25;"></fa-icon>
            <p style="font-weight: 700; font-size: 1rem;">Złotno - Kino Tomi</p>
        </RouterLink>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import { ref } from 'vue';

const checked = ref(true);
export default {
    name: 'NavbarLocationInfo',
    data: () => ({
        //
    }),
}
</script>

<style>
#cinemainfo {
    display: flex;
    color: white;
}
</style>