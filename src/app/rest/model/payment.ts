/**
 * OpenAPI definition
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { RegistrationDTO } from './registration';


export interface PaymentDTO { 
    registration?: RegistrationDTO;
    id?: number;
    price: number;
    deposit?: number;
    discountValue?: number;
    discountPercent?: number;
    depositPaid?: boolean;
    paid?: boolean;
    final_price?: number;
    hasDiscount?: boolean;
    hasDeposit?: boolean;
    remainingValue?: number;
}

