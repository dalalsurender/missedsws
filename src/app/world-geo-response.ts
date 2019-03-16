export interface Suggestion {
    text: string;
    magicKey: string;
    isCollection: boolean;
}

export interface WorldGeoResponse {
    suggestions: Suggestion[];
}
