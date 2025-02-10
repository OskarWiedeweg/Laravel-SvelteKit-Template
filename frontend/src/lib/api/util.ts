export function keysToCamelCase<T = any>(data: any): T {
    return transformObjectKeys(data, fieldNameToCamelCase);
}

export function keysToSnakeCase<T = any>(data: any): T {
    return transformObjectKeys(data, fieldNameToSnakeCase);
}

function transformObjectKeys<T = any>(data: any, transformer: ((key: string) => string)): T {
    // Handle null/undefined
    if (data === null || data === undefined) {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => transformObjectKeys(item, transformer)) as T;
    }

    // Handle non-objects
    if (typeof data !== 'object') {
        return data;
    }

    // Process object
    const newData: Record<string, any> = {};

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const newKey = transformer(key);
            newData[newKey] = transformObjectKeys(data[key], transformer);
        }
    }

    return newData as T;
}

function fieldNameToCamelCase(key: string) {
    return key.replace(/_([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}

function fieldNameToSnakeCase(key: string) {
    return key.replace(/([A-Z])/g, "_$1").toLowerCase();
}