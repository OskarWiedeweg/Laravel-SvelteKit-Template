<script lang="ts">
    import {superForm} from 'sveltekit-superforms';
    import {zodClient} from 'sveltekit-superforms/adapters';
    import type {ZodSchema} from 'zod';
    import type {FormLayout} from "$lib/components/autoform/types";
    import Layout from "$lib/components/autoform/Layout.svelte";
    import FormGlobalError from "$lib/components/FormGlobalError.svelte";

    const {
        schema,
        form: formInput,
        layout: formLayout,
        action
    }: {
        schema: ZodSchema,
        form: any,
        layout: FormLayout,
        action?: string
    } = $props();

    const form = superForm(formInput, {
        validators: zodClient(schema),
        dataType: 'json'
    });

    const {form: formData, enhance, allErrors} = form;
</script>

<FormGlobalError errors={$allErrors}/>
<form class="grid gap-2 lg:grid-cols-[1fr_300px]" method="post" use:enhance {action}>
    <div class="grid gap-2">
        {#each formLayout.main as layout}
            <Layout {layout} {form} {formData}/>
        {/each}
    </div>
    {#if (formLayout.side)}
        <Layout layout={formLayout.side} {form} {formData}/>
    {/if}
</form>