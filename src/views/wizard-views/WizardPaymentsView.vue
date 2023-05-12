<template>
    <WizardTemplate>
        <WizardPayments />
    </WizardTemplate>
</template>

<script>
import WizardTemplate from '../../components/templates/WizardTemplate.vue';
import WizardPayments from '../../components/wizard/WizardPaymentsComponent.vue';

export default {
    components: {
        WizardTemplate,
        WizardPayments
    },
};
</script>