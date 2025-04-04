export const isFieldRequired = (isUpdate) => (value) =>
    !isUpdate || value !== undefined;
