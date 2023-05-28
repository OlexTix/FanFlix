<template>
    <AdminPanelTemplate>
        <Menubar :model="items" />
        <ScreeningsTable class="screening-table" />
    </AdminPanelTemplate>
</template>

<script>
import AdminPanelTemplate from '../../components/templates/AdminPanelTemplate.vue';
import ScreeningsTable from '../../components/admin/screenings/ScreeningsTableComponent2.vue';
import Menubar from 'primevue/menubar';

export default {
    components: {
        AdminPanelTemplate,
        ScreeningsTable,
        Menubar
    },
    data() {
        return {
            items: [
                {
                    label: 'Zarządzanie Seansami',
                    icon: 'pi pi-fw pi-video',
                    items: [
                        { label: 'Dodaj Nowy', icon: 'pi pi-fw pi-plus' },
                        { label: 'Edytuj Istniejący', icon: 'pi pi-fw pi-pencil' },
                        { label: 'Usuń', icon: 'pi pi-fw pi-trash' },
                    ],
                },
                {
                    label: 'Przypisywanie Filmów',
                    icon: 'pi pi-fw pi-film',
                    items: [
                        { label: 'Dodaj do Seansu', icon: 'pi pi-fw pi-plus' },
                        { label: 'Usuń z Seansu', icon: 'pi pi-fw pi-minus' },
                    ],
                },
                {
                    label: 'Zarządzanie Rezerwacjami',
                    icon: 'pi pi-fw pi-ticket',
                    items: [
                        { label: 'Zobacz Rezerwacje', icon: 'pi pi-fw pi-search' },
                        { label: 'Potwierdź Kod', icon: 'pi pi-fw pi-check' },
                    ],
                },
                {
                    label: 'Raporty',
                    icon: 'pi pi-fw pi-chart-bar',
                    items: [
                        { label: 'Generuj Raport', icon: 'pi pi-fw pi-file' },
                    ],
                },
                {
                    label: 'Ustawienia',
                    icon: 'pi pi-fw pi-cog',
                },
            ],
        };
    },
};
</script>

<style scoped>
.screening-table{
    padding: 1.5rem;
}
</style>