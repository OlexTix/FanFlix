<template>
    <Dialog 
        :visible="visible" 
        @update:visible="$emit('update:visible', $event)" 
        :style="{width: '450px'}" 
        header="Confirm" 
        :modal="true">

        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="item" class="confirmation-content-span">Czy napewno chcesz usunąć <b>{{item.title}}</b>?</span>
        </div>

        <template #footer>
            <Button label="Yes" icon="pi pi-check" text @click="$emit('confirm')" />
            <Button label="No" icon="pi pi-times" text @click="$emit('update:visible', false)"/>
        </template>
        
    </Dialog>
</template>

<script>
export default {
    name: 'ConfirmationDialogComponent',
    props: ['visible', 'item'],
};
</script>
<style scoped>
.confirmation-content {
    display: flex;
    align-items: center
}

.confirmation-content-span{
    margin-left: 1rem;
}
</style>
