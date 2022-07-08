/* tslint:disable */
/* eslint-disable */
/**
 * Immich
 * Immich API
 *
 * The version of the OpenAPI document: 1.17.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface LoginResponseDto
 */
export interface LoginResponseDto {
    /**
     * 
     * @type {string}
     * @memberof LoginResponseDto
     */
    readonly accessToken: string;
    /**
     * 
     * @type {string}
     * @memberof LoginResponseDto
     */
    readonly userId: string;
    /**
     * 
     * @type {string}
     * @memberof LoginResponseDto
     */
    readonly userEmail: string;
    /**
     * 
     * @type {string}
     * @memberof LoginResponseDto
     */
    readonly firstName: string;
    /**
     * 
     * @type {string}
     * @memberof LoginResponseDto
     */
    readonly lastName: string;
    /**
     * 
     * @type {string}
     * @memberof LoginResponseDto
     */
    readonly profileImagePath: string;
    /**
     * 
     * @type {boolean}
     * @memberof LoginResponseDto
     */
    readonly isAdmin: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof LoginResponseDto
     */
    readonly shouldChangePassword: boolean;
}

/**
 * Check if a given object implements the LoginResponseDto interface.
 */
export function instanceOfLoginResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "accessToken" in value;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "userEmail" in value;
    isInstance = isInstance && "firstName" in value;
    isInstance = isInstance && "lastName" in value;
    isInstance = isInstance && "profileImagePath" in value;
    isInstance = isInstance && "isAdmin" in value;
    isInstance = isInstance && "shouldChangePassword" in value;

    return isInstance;
}

export function LoginResponseDtoFromJSON(json: any): LoginResponseDto {
    return LoginResponseDtoFromJSONTyped(json, false);
}

export function LoginResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): LoginResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'accessToken': json['accessToken'],
        'userId': json['userId'],
        'userEmail': json['userEmail'],
        'firstName': json['firstName'],
        'lastName': json['lastName'],
        'profileImagePath': json['profileImagePath'],
        'isAdmin': json['isAdmin'],
        'shouldChangePassword': json['shouldChangePassword'],
    };
}

export function LoginResponseDtoToJSON(value?: LoginResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
    };
}

