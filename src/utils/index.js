import { AxiosError, HttpStatusCode } from "axios";

export const handleAxiosErrors = error => {
    let errorMessage = error.message;
    let errorStatus = HttpStatusCode.InternalServerError;
    if (error instanceof AxiosError) {
        const { status, message } = error;
        errorMessage = message;
        errorStatus = status
    }
    return { errorMessage, errorStatus };
}