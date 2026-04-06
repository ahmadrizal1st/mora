<?php

namespace App\Notifications;

use App\Models\OtpCode;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OtpNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected string $code,
        protected string $type
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Build the mail representation.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $subject = match ($this->type) {
            OtpCode::TYPE_REGISTER => 'Verifikasi Email — Kode OTP Anda',
            OtpCode::TYPE_RESET_PASSWORD => 'Reset Password — Kode OTP Anda',
            default => 'Kode OTP Anda',
        };

        $greeting = match ($this->type) {
            OtpCode::TYPE_REGISTER => 'Selamat datang di ' . config('app.name') . '!',
            OtpCode::TYPE_RESET_PASSWORD => 'Permintaan Reset Password',
            default => 'Kode OTP Anda',
        };

        $introLine = match ($this->type) {
            OtpCode::TYPE_REGISTER => 'Gunakan kode OTP berikut untuk memverifikasi alamat email Anda:',
            OtpCode::TYPE_RESET_PASSWORD => 'Kami menerima permintaan reset password untuk akun Anda. Gunakan kode OTP berikut:',
            default => 'Berikut adalah kode OTP Anda:',
        };

        return (new MailMessage)
            ->subject($subject)
            ->greeting($greeting)
            ->line($introLine)
            ->line('**' . $this->code . '**')
            ->line('Kode ini berlaku selama 10 menit.')
            ->line('Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini.')
            ->salutation('Salam, ' . config('app.name'));
    }
}
