export default function capitalizeFirstLetter(input: string): string {
    if (!input) return input; // Handle empty or null strings
    return input.charAt(0).toUpperCase() + input.slice(1);
};