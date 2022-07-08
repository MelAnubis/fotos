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
 * @interface SearchAssetDto
 */
export interface SearchAssetDto {
    /**
     * 
     * @type {string}
     * @memberof SearchAssetDto
     */
    searchTerm: string;
}

/**
 * Check if a given object implements the SearchAssetDto interface.
 */
export function instanceOfSearchAssetDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "searchTerm" in value;

    return isInstance;
}

export function SearchAssetDtoFromJSON(json: any): SearchAssetDto {
    return SearchAssetDtoFromJSONTyped(json, false);
}

export function SearchAssetDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchAssetDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'searchTerm': json['searchTerm'],
    };
}

export function SearchAssetDtoToJSON(value?: SearchAssetDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'searchTerm': value.searchTerm,
    };
}

