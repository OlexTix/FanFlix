<template>
  <div class="card">
        <Carousel :value="products" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplayInterval="4000">
            <template #item="slotProps">
                <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
                    <div class="mb-3">
                        <img :src="'https://primefaces.org/cdn/primevue/images/product/' + slotProps.data.image" :alt="slotProps.data.name" class="w-6 shadow-2" />
                    </div>
                    <div>
                        <h4 class="mb-1">{{ slotProps.data.name }}</h4>
                        <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data.inventoryStatus)" />
                        <!-- <div class="mt-5">
                            <Button icon="pi pi-search" rounded class="mr-2" />
                            <Button icon="pi pi-star-fill" rounded severity="success" class="mr-2" />
                            <Button icon="pi pi-cog" rounded severity="help" />
                        </div> -->
                    </div>
                </div>
            </template>
        </Carousel>
    </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { ProductService } from '@/service/ProductService';

onMounted(() => {
  ProductService.getProductsSmall().then((data) => (products.value = data.slice(0, 9)));
})

const products = ref();
const responsiveOptions = ref([
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    }
]);

const getSeverity = (status) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

</script>

<!-- images cdn carousel
  https://media.multikino.pl/thumbnails/50/rc/MEZBMkE0/eyJ0aHVtYm5haWwiOnsic2l6ZSI6WyIxMDAwMCIsIjEwMDAwIl0sIm1vZGUiOiJpbnNldCJ9fQ==/uploads/images/films_and_events/kot-w-butach-ostatnie-zyczenie-plakat-do-netu-cut_4db55b0c55.jpg 
  https://cdn.gracza.pl/galeria/mdb/f/3448000.jpg
  https://lumiere-a.akamaihd.net/v1/images/image_78a5dfe3.jpeg?region=0%2C0%2C540%2C810
  https://a.allegroimg.com/original/11b6f4/dbf0906142e89ac56d037b0b4ab3/Plakat-filmowy-SCREAM-VI-2023-Krzyk-VI-6-70x50
  https://media.multikino.pl/thumbnails/50/rc/MTYxNjY1/eyJ0aHVtYm5haWwiOnsic2l6ZSI6WyIxMDAwMCIsIjEwMDAwIl0sIm1vZGUiOiJpbnNldCJ9fQ==/uploads/images/films_and_events/pl-poland-shzam2-apple-poster-main-2764x4096-intl-cut_35930959de.jpg

--> 