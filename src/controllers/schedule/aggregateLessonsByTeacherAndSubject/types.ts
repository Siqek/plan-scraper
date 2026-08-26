export type SubjectHourCount =
    Record<string, number>;

// export type TeacherSubjectHours = {
//     teachers: Map<string, {
//         subjects: Map<string, {
//             hourCount: number;
//         }>;
//     }>;

//     uncategorized: Map<string, {
//         count: number
//     }>;
// };

export type TeacherSubjectHours = {
    teachers: Record<string, SubjectHourCount>;

    uncategorized: Record<string, {
        count: number
    }>;
};

export type ClassTeacherSubjectHours =
    Record<string, TeacherSubjectHours>;
