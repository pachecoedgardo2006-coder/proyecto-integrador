import { dbQuery } from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';

// Get all mentors with their specialties
export const getMentors = asyncHandler(async (req, res) => {
    const query = `
        SELECT 
            m.id AS mentor_id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            m.biography,
            m.experience,
            m.average_rating,
            COALESCE(
                json_agg(
                    json_build_object('id', s.id, 'name', s.name)
                ) FILTER (WHERE s.id IS NOT NULL), '[]'
            ) AS specialties
        FROM "mentor" m
        JOIN "user" u ON m.user_id = u.id_number
        LEFT JOIN "mentor_specialty" ms ON m.id = ms.mentor_id
        LEFT JOIN "specialty" s ON ms.specialty_id = s.id
        WHERE u.active = true
        GROUP BY m.id, u.first_name, u.last_name, u.email, u.phone;
    `;
    const result = await dbQuery(query);
    res.status(200).json(result.rows);
});

// Get detailed mentor information, including availability
export const getMentorDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const mentorQuery = `
        SELECT 
            m.id AS mentor_id,
            u.first_name,
            u.last_name,
            u.email,
            m.biography,
            m.experience,
            m.average_rating
        FROM "mentor" m
        JOIN "user" u ON m.user_id = u.id_number
        WHERE m.id = $1;
    `;
    const mentorResult = await dbQuery(mentorQuery, [id]);

    if (mentorResult.rows.length === 0) {
        return res.status(404).json({ message: 'Mentor not found' });
    }

    const availabilityQuery = `
        SELECT id, day_of_week, start_time, end_time, status
        FROM "availability"
        WHERE mentor_id = $1 AND status = 'available';
    `;
    const availabilityResult = await dbQuery(availabilityQuery, [id]);

    const mentor = mentorResult.rows[0];
    mentor.availabilities = availabilityResult.rows;

    res.status(200).json(mentor);
});