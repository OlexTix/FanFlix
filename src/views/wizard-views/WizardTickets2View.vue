<template>
    <WizardTemplate>
        <WizardTickets />
    </WizardTemplate>
</template>

<script>
import WizardTemplate from '../../components/templates/WizardTemplate.vue';
import WizardTickets from '../../components/wizard/WizardTicketsComponent.vue';

export default {
    components: {
        WizardTemplate,
        WizardTickets
    },
};
</script>