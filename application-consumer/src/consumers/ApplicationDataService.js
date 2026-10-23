import { Pool } from 'pg';

class ApplicationDataService {
    constructor() {
        this._pool = new Pool();
    }

    async getApplicationDetail(applicationId) {
        const query = {
            text: `
        SELECT 
          a.id AS application_id,
          a.created_at AS application_created_at,
          u_applicant.name AS applicant_name,
          u_applicant.email AS applicant_email,
          j.id AS job_id,
          j.user_id AS job_owner_id,
          u_owner.email AS owner_email
        FROM applications a
        JOIN users u_applicant ON a.user_id = u_applicant.id
        JOIN jobs j ON a.job_id = j.id
        JOIN users u_owner ON j.user_id = u_owner.id
        WHERE a.id = $1
      `,
            values: [applicationId],
        };
        const result = await this._pool.query(query);
        return result.rows[0];
    }
}

export default ApplicationDataService;