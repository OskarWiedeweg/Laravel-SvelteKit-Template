export type Field = {
    name: string;
    type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date';
    label: string;
    placeholder?: string;
    description?: string;
    options?: { label: string; value: string }[];
    dependent?: {
        field: string;
        value: any;
    };
    cols?: 1 | 2;
    addon?: {
        type: 'button' | 'checkbox';
        label: string;
        action?: () => void;
    };
} | {
    type: 'submit',
    label: string
}

export type Layout = {
    fields: Field[],
    head?: {
        title: string,
        description?: string
    }
}

export type FormLayout = {
    main: Layout[],
    side?: Layout
}