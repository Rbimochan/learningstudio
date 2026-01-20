/**
 * Route Helpers - Centralized route management
 */

export const routes = {
    // Auth routes
    auth: {
        login: '/login',
        signup: '/signup',
        callback: '/auth/callback',
    },

    // Workspace routes
    workspace: {
        root: '/paths',
        paths: '/paths',
        newPath: '/paths/new',
        path: (pathId: string) => `/paths/${pathId}`,
        editPath: (pathId: string) => `/paths/${pathId}/edit`,
        
        // Course routes
        courses: (pathId: string) => `/paths/${pathId}/courses`,
        newCourse: (pathId: string) => `/paths/${pathId}/courses/new`,
        course: (pathId: string, courseId: string) => `/paths/${pathId}/courses/${courseId}`,
        editCourse: (pathId: string, courseId: string) => `/paths/${pathId}/courses/${courseId}/edit`,
        
        // Studio route
        studio: (lessonId: string) => `/studio/${lessonId}`,
    },

    // API routes
    api: {
        courses: '/api/courses',
        lessons: '/api/lessons',
        lessonsReorder: '/api/lessons/reorder',
        notes: '/api/notes',
        progress: '/api/progress',
        youtubeMetadata: '/api/youtube/metadata',
    },
} as const;

/**
 * Helper to check if a path is a workspace route
 */
export function isWorkspaceRoute(path: string): boolean {
    return path.startsWith('/paths') || path.startsWith('/studio');
}

/**
 * Helper to check if a path is an auth route
 */
export function isAuthRoute(path: string): boolean {
    return path.startsWith('/login') || path.startsWith('/signup');
}

/**
 * Get the redirect path after successful login
 */
export function getPostLoginRedirect(returnTo?: string | null): string {
    if (returnTo && isWorkspaceRoute(returnTo)) {
        return returnTo;
    }
    return routes.workspace.paths;
}
