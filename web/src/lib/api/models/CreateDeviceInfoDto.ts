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
 * @interface CreateDeviceInfoDto
 */
export interface CreateDeviceInfoDto {
    /**
     * 
     * @type {string}
     * @memberof CreateDeviceInfoDto
     */
    deviceId: string;
    /**
     * 
     * @type {string}
     * @memberof CreateDeviceInfoDto
     */
    deviceType: CreateDeviceInfoDtoDeviceTypeEnum;
    /**
     * 
     * @type {boolean}
     * @memberof CreateDeviceInfoDto
     */
    isAutoBackup?: boolean;
}


/**
 * @export
 */
export const CreateDeviceInfoDtoDeviceTypeEnum = {
    Ios: 'IOS',
    Android: 'ANDROID',
    Web: 'WEB'
} as const;
export type CreateDeviceInfoDtoDeviceTypeEnum = typeof CreateDeviceInfoDtoDeviceTypeEnum[keyof typeof CreateDeviceInfoDtoDeviceTypeEnum];


/**
 * Check if a given object implements the CreateDeviceInfoDto interface.
 */
export function instanceOfCreateDeviceInfoDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "deviceId" in value;
    isInstance = isInstance && "deviceType" in value;

    return isInstance;
}

export function CreateDeviceInfoDtoFromJSON(json: any): CreateDeviceInfoDto {
    return CreateDeviceInfoDtoFromJSONTyped(json, false);
}

export function CreateDeviceInfoDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateDeviceInfoDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'deviceId': json['deviceId'],
        'deviceType': json['deviceType'],
        'isAutoBackup': !exists(json, 'isAutoBackup') ? undefined : json['isAutoBackup'],
    };
}

export function CreateDeviceInfoDtoToJSON(value?: CreateDeviceInfoDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'deviceId': value.deviceId,
        'deviceType': value.deviceType,
        'isAutoBackup': value.isAutoBackup,
    };
}

