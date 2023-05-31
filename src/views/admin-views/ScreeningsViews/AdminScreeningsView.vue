<template>
    <AdminPanelTemplate>
        <ScreeningsMenu />
        <ScreeningsTable class="screening-table" />
    </AdminPanelTemplate>
</template>

<script>
import AdminPanelTemplate from '../../../components/templates/AdminPanelTemplate.vue';
import ScreeningsTable from '../../../components/admin/screenings/ScreeningsTableComponent.vue';
import ScreeningsMenu from '../../../components/admin/screenings/ScreeningsMenuComponent.vue';

export default {
    components: {
        AdminPanelTemplate,
        ScreeningsTable,
        ScreeningsMenu
    },
    data() {
        return {
            
        };
    },
};
</script>

<style scoped>
.screening-table{
    padding: 1.5rem;
}
</style>