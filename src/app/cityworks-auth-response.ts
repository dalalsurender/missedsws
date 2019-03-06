export interface Value {
	token: string;
}

export interface CityworksAuthResponse {
	value: Value;
	status: number;
	message?: any;
	errorMessages: any[];
	warningMessages: any[];
	successMessages: any[];
}