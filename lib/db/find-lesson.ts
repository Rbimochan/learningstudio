import { getPathsForUser } from './paths';
import { getCoursesForPath } from './courses';
import { getLessonsForCourse } from './lessons';

async function findFirstLesson() {
    try {
        const paths = await getPathsForUser();
        if (paths.length === 0) {
            console.log("No paths found");
            return;
        }

        for (const path of paths) {
            const courses = await getCoursesForPath(path.id);
            for (const course of courses) {
                const lessons = await getLessonsForCourse(course.id);
                if (lessons.length > 0) {
                    console.log("FOUND_LESSON_ID:", lessons[0].id);
                    return;
                }
            }
        }
        console.log("No lessons found in any path");
    } catch (error) {
        console.error("Error finding lesson:", error);
    }
}

findFirstLesson();
