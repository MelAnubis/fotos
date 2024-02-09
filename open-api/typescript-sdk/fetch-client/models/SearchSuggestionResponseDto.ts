/* tslint:disable */
/* eslint-disable */
/**
 * Immich
 * Immich API
 *
 * The version of the OpenAPI document: 1.94.1
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
 * @interface SearchSuggestionResponseDto
 */
export interface SearchSuggestionResponseDto {
    /**
     * 
     * @type {Array<string>}
     * @memberof SearchSuggestionResponseDto
     */
    data?: Array<string>;
}

/**
 * Check if a given object implements the SearchSuggestionResponseDto interface.
 */
export function instanceOfSearchSuggestionResponseDto(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function SearchSuggestionResponseDtoFromJSON(json: any): SearchSuggestionResponseDto {
    return SearchSuggestionResponseDtoFromJSONTyped(json, false);
}

export function SearchSuggestionResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchSuggestionResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'data': !exists(json, 'data') ? undefined : json['data'],
    };
}

export function SearchSuggestionResponseDtoToJSON(value?: SearchSuggestionResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'data': value.data,
    };
}

