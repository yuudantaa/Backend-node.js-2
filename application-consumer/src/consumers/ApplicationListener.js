import ApplicationDataService from './ApplicationDataService.js';
import MailSender from './MailSender.js';

class ApplicationListener {
    constructor() {
        this._applicationDataService = new ApplicationDataService();
        this._mailSender = new MailSender();

        this.listen = this.listen.bind(this);
    }

    async listen(message) {
        try {
            const { applicationId } = JSON.parse(message.content.toString());
            console.log(`Processing application ID: ${applicationId}`);

            // Ambil data dari database
            const detail = await this._applicationDataService.getApplicationDetail(applicationId);
            if (!detail) {
                console.error(`Application ${applicationId} not found`);
                return;
            }

            // Kirim email ke pemilik lowongan (job owner)
            const subject = `Notifikasi Lamaran Baru untuk Pekerjaan ${detail.job_id}`;
            const html = `
        <h2>Ada lamaran baru untuk lowongan Anda</h2>
        <p><strong>Pelamar:</strong> ${detail.applicant_name} (${detail.applicant_email})</p>
        <p><strong>Tanggal Lamaran:</strong> ${new Date(detail.application_created_at).toLocaleString('id-ID')}</p>
        <p>Silakan cek dashboard Anda untuk informasi lebih lanjut.</p>
      `;

            await this._mailSender.sendEmail(detail.owner_email, subject, html);
            console.log(`Email sent to owner: ${detail.owner_email}`);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
}

export default ApplicationListener;