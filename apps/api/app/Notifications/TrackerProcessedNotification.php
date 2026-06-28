<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TrackerProcessedNotification extends Notification
{
    use Queueable;

    
    public function __construct(
        protected string $status,
        protected string $title,
        protected string $message,
        protected array $extraData = []
    ) {}

    
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    
    public function toArray(object $notifiable): array
    {
        return [
            'status' => $this->status,
            'title' => $this->title,
            'message' => $this->message,
            'extra_data' => $this->extraData,
        ];
    }
}
