<script lang="ts">
    import type {Field} from "./types";
    import {Button} from '$lib/components/ui/button';
    import {Input} from '$lib/components/ui/input';
    import {Label} from '$lib/components/ui/label';
    import {Textarea} from '$lib/components/ui/textarea';
    import {Select, SelectContent, SelectItem, SelectTrigger} from '$lib/components/ui/select';
    import {Checkbox} from '$lib/components/ui/checkbox';
    import {FormButton, FormControl, FormDescription, FormField, FormFieldErrors} from '$lib/components/ui/form';
    import type {SuperForm, SuperFormData} from "sveltekit-superforms/client";
    import {LoaderCircle} from "lucide-svelte";

    const {fields, formData, form}: {
        fields: Field[],
        formData: SuperFormData<any>,
        form: SuperForm<any>
    } = $props();
</script>

{#each fields as field}
    <div class={field.cols === 2 ? "grid gap-4 md:grid-cols-2" : ""}>
        {#if field.type === "submit"}
            <FormButton type="submit" disabled={form.$submitting} class="w-full">
                {#if form.$submitting}
                    <LoaderCircle class="mr-2 h-4 w-4 animate-spin"/>
                {/if}
                {field.label}
            </FormButton>
        {:else if !field.dependent || $formData[field.dependent.field] === field.dependent.value}
            <FormField {form} name={field.name}>
                <FormControl>
                    {#snippet children({props})}
                        {#if field.type === 'select'}
                            <Label>{field.label}</Label>
                            <Select type="single" bind:value={$formData[field.name]} {...props}>
                                <SelectTrigger>
                                    {field.options?.find(opt => opt.value === $formData[field.name])?.label ||
                                    field.placeholder || 'Select an option'}
                                </SelectTrigger>
                                <SelectContent>
                                    {#each field.options || [] as option}
                                        <SelectItem value={option.value}>{option.label}</SelectItem>
                                    {/each}
                                </SelectContent>
                            </Select>

                        {:else if field.type === 'textarea'}
                            <Label>{field.label}</Label>
                            <Textarea
                                    bind:value={$formData[field.name]}
                                    placeholder={field.placeholder}
                                    {...props}
                            />

                        {:else if field.type === 'checkbox'}
                            <div class="flex items-center gap-2">
                                <Checkbox
                                        bind:checked={$formData[field.name]}
                                        {...props}
                                />
                                <Label>{field.label}</Label>
                            </div>

                        {:else}
                            <Label>{field.label}</Label>
                            {#if field.addon}
                                <div class="flex items-center gap-2">
                                    <Input
                                            type={field.type}
                                            bind:value={$formData[field.name]}
                                            placeholder={field.placeholder}
                                            {...props}
                                    />
                                    {#if field.addon.type === 'button'}
                                        <Button type="button" on:click={field.addon.action}>
                                            {field.addon.label}
                                        </Button>
                                    {:else}
                                        <div class="flex items-center gap-2">
                                            <Checkbox
                                                    bind:checked={$formData[field.name + 'Toggle']}
                                            />
                                            <Label>{field.addon.label}</Label>
                                        </div>
                                    {/if}
                                </div>
                            {:else}
                                <Input
                                        type={field.type}
                                        bind:value={$formData[field.name]}
                                        placeholder={field.placeholder}
                                        {...props}
                                />
                            {/if}
                        {/if}
                    {/snippet}
                </FormControl>
                {#if (field.description)}
                    <FormDescription>{field.description}</FormDescription>
                {/if}
                <FormFieldErrors/>
            </FormField>
        {/if}
    </div>
{/each}