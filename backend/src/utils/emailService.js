// Backend utilities untuk email
import nodemailer from 'nodemailer'

// Konfigurasi transporter email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })
    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Template email untuk registrasi
export const registrationEmailTemplate = (name, confirmLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Selamat Datang di Adopsi Hewan!</h1>
      <p>Hi ${name},</p>
      <p>Terima kasih telah mendaftar di platform Adopsi Hewan Modern.</p>
      <p>Silakan klik tombol di bawah untuk mengkonfirmasi email Anda:</p>
      <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px;">
        Konfirmasi Email
      </a>
      <p>Atau copy link ini: ${confirmLink}</p>
      <p>Best regards,<br>Tim Adopsi Hewan</p>
    </div>
  `
}

// Template email untuk pengajuan adopsi
export const adoptionApplicationTemplate = (userName, animalName, status) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Status Pengajuan Adopsi</h1>
      <p>Hi ${userName},</p>
      <p>Status pengajuan adopsi untuk <strong>${animalName}</strong> adalah <strong>${status}</strong>.</p>
      <p>Silakan login ke dashboard untuk melihat detail lebih lanjut.</p>
      <p>Best regards,<br>Tim Adopsi Hewan</p>
    </div>
  `
}

// Template email untuk notifikasi adopsi berhasil
export const adoptionApprovedTemplate = (userName, animalName, shelterName, shelterPhone) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Selamat! Adopsi Disetujui 🎉</h1>
      <p>Hi ${userName},</p>
      <p>Pengajuan adopsi Anda untuk <strong>${animalName}</strong> telah disetujui!</p>
      <p>Hubungi shelter untuk langkah selanjutnya:</p>
      <p>
        <strong>${shelterName}</strong><br>
        Phone: ${shelterPhone}
      </p>
      <p>Best regards,<br>Tim Adopsi Hewan</p>
    </div>
  `
}
