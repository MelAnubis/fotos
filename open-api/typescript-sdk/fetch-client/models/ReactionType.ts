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


/**
 * 
 * @export
 */
export const ReactionType = {
    Comment: 'comment',
    Like: 'like'
} as const;
export type ReactionType = typeof ReactionType[keyof typeof ReactionType];


export function ReactionTypeFromJSON(json: any): ReactionType {
    return ReactionTypeFromJSONTyped(json, false);
}

export function ReactionTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): ReactionType {
    return json as ReactionType;
}

export function ReactionTypeToJSON(value?: ReactionType | null): any {
    return value as any;
}

