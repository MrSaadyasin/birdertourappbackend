export declare class GoogleStrategy {
    private client;
    constructor();
    createConsentUrl(): string;
    authenticate(code: string): Promise<any>;
}
export declare class GoogleVendorStrategy {
    private client;
    constructor();
    createConsentUrl(): string;
    authenticate(code: string): Promise<any>;
}
