<template>
    <Menubar :model="items" />
</template>

<script>
export default {
    data() {
        return {
            items: [
                {
                    label: 'Zarządzanie seansami',
                    icon: 'pi pi-fw pi-video',
                    items: [
                        { 
                            label: 'Dodaj Nowy', 
                            icon: 'pi pi-fw pi-plus',
                            to: '/admin-panel/screenings/add'
                        },
                        {
                            label: 'Przypisanie filmów',
                            icon: 'pi pi-fw pi-film',
                            items: [
                                { label: 'Dodaj do Seansu', icon: 'pi pi-fw pi-plus' },
                                { label: 'Usuń z Seansu', icon: 'pi pi-fw pi-minus' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Zarządzanie rezerwacjami',
                    icon: 'pi pi-fw pi-ticket',
                    items: [
                        { label: 'Zobacz rezerwacje', icon: 'pi pi-fw pi-search' },
                        { label: 'Potwierdź kod', icon: 'pi pi-fw pi-check' },
                    ],
                },
                {
                    label: 'Raporty',
                    icon: 'pi pi-fw pi-chart-bar',
                    items: [
                        { label: 'Generuj Raport', icon: 'pi pi-fw pi-file' },
                    ],
                }
            ],
        };
    },
};
</script>