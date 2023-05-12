<template>
    <WizardTemplate>
        <WizardSeats />
    </WizardTemplate>
</template>

<script>
import WizardTemplate from '../../components/templates/WizardTemplate.vue';
import WizardSeats from '../../components/wizard/WizardSitsComponent.vue';

export default {
    components: {
        WizardTemplate,
        WizardSeats
    },
};
</script>