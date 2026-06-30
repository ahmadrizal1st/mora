<?php

namespace App\Notifications;

use App\Models\Extraction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class ExtractionProcessedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Extraction $extraction,
        protected string $status,
        protected ?string $message = null
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $statusText = $this->status === 'completed' ? 'Berhasil' : 'Gagal';
        return [
            'extraction_id' => $this->extraction->id,
            'file_name' => $this->extraction->file_name,
            'status' => $this->status,
            'title' => "Ekstraksi Data {$statusText}",
            'message' => $this->message ?? "File {$this->extraction->file_name} telah selesai diproses.",
            'extra_data' => [
                'transactions_count' => count($this->extraction->transactions ?? []),
            ],
            'label' => 'extraction',
        ];
    }
}
