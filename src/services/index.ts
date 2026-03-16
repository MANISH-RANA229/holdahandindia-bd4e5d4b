/**
 * Services barrel export.
 * 
 * Import from "@/services" for clean access:
 *   import { studentService, authService } from "@/services";
 */

export { authService } from "./authService";
export { studentService } from "./studentService";
export { mentorService } from "./mentorService";
export { sessionService } from "./sessionService";
export { messageService } from "./messageService";
export { growthService } from "./growthService";
export { seriousnessService } from "./seriousnessService";
export { supportService } from "./supportService";
export { httpClient, ApiError, setUnauthorizedHandler, clearUnauthorizedHandler } from "./httpClient";
export { API_CONFIG, ENDPOINTS } from "./apiConfig";
