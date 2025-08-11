export interface ServiceAddOn {
    pkAddon: number;
    isRetail: number;
    name: string;
    description: string;
    contentWeb: string;
    price: number;
    fkService: number;
    status?: number;
}