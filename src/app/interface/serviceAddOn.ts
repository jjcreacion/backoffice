export interface ServiceAddOn {
    pkAddon: number;
    isReail: number;
    name: string;
    description: string;
    contentWeb: string;
    price: number;
    fkService: number;
    status?: number;
}