/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResearchGapRequest } from '../models/ResearchGapRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Root
     * **
     * * @brief Root endpoint for the API.
     * * @return A welcome message.
     * *
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rootGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Get Research Gaps Endpoint
     * **
     * * @brief Endpoint to get research gaps for a given query.
     * *
     * * @param request The request containing the user's query.
     * * @return A dictionary containing either research gaps or an error message under a "detail" key.
     * *
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getResearchGapsEndpointResearchGapsPost(
        requestBody: ResearchGapRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/research-gaps',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Health Check
     * **
     * * @brief Health check endpoint for the API.
     * * @return A status message.
     * *
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthCheckHealthGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
}
