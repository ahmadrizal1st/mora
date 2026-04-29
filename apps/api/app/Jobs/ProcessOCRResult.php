<?php

namespace App\Jobs;

use App\Enums\DocumentSchema;
use App\Models\Category;
use App\Models\Document;
use App\Models\Tag;
use App\Services\LLMMapper;
use App\Services\PromptBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class ProcessOCRResult implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $backoff = 10;

    /**
     * Map dari kata kunci yang mungkin dikembalikan LLM (bahasa Inggris / Indonesia)
     * ke nama kategori di DB (kolom `name`).
     */
    private const CATEGORY_MAP = [
        // Food & Drink
        'food'              => 'Makanan & Minuman',
        'food & beverage'   => 'Makanan & Minuman',
        'food and drink'    => 'Makanan & Minuman',
        'beverage'          => 'Makanan & Minuman',
        'makanan'           => 'Makanan & Minuman',
        'minuman'           => 'Makanan & Minuman',
        'makan'             => 'Makanan & Minuman',
        'kuliner'           => 'Makanan & Minuman',
        'restoran'          => 'Makanan & Minuman',
        'restaurant'        => 'Makanan & Minuman',
        'cafe'              => 'Makanan & Minuman',
        'kafe'              => 'Makanan & Minuman',

        // Transport
        'transport'         => 'Transportasi',
        'transportation'    => 'Transportasi',
        'transportasi'      => 'Transportasi',
        'travel'            => 'Transportasi',
        'perjalanan'        => 'Transportasi',
        'ojek'              => 'Transportasi',
        'taxi'              => 'Transportasi',
        'taksi'             => 'Transportasi',
        'bus'               => 'Transportasi',
        'grab'              => 'Transportasi',
        'gojek'             => 'Transportasi',
        'bensin'            => 'Transportasi',
        'fuel'              => 'Transportasi',

        // Shopping
        'shopping'          => 'Belanja',
        'belanja'           => 'Belanja',
        'shop'              => 'Belanja',
        'grocery'           => 'Belanja',
        'groceries'         => 'Belanja',
        'supermarket'       => 'Belanja',
        'retail'            => 'Belanja',

        // Entertainment
        'entertainment'     => 'Hiburan',
        'hiburan'           => 'Hiburan',
        'leisure'           => 'Hiburan',
        'recreation'        => 'Hiburan',
        'rekreasi'          => 'Hiburan',
        'gaming'            => 'Hiburan',
        'game'              => 'Hiburan',
        'bioskop'           => 'Hiburan',
        'cinema'            => 'Hiburan',
        'movie'             => 'Hiburan',
        'musik'             => 'Hiburan',
        'musik'             => 'Hiburan',

        // Health
        'health'            => 'Kesehatan',
        'healthcare'        => 'Kesehatan',
        'kesehatan'         => 'Kesehatan',
        'medical'           => 'Kesehatan',
        'medis'             => 'Kesehatan',
        'dokter'            => 'Kesehatan',
        'obat'              => 'Kesehatan',
        'apotik'            => 'Kesehatan',
        'apotek'            => 'Kesehatan',
        'rumah sakit'       => 'Kesehatan',
        'hospital'          => 'Kesehatan',
        'klinik'            => 'Kesehatan',

        // Education
        'education'         => 'Pendidikan',
        'pendidikan'        => 'Pendidikan',
        'school'            => 'Pendidikan',
        'sekolah'           => 'Pendidikan',
        'kursus'            => 'Pendidikan',
        'les'               => 'Pendidikan',
        'buku'              => 'Pendidikan',
        'kuliah'            => 'Pendidikan',

        // Utilities & Bills
        'utilities'         => 'Tagihan & Utilitas',
        'utility'           => 'Tagihan & Utilitas',
        'bill'              => 'Tagihan & Utilitas',
        'bills'             => 'Tagihan & Utilitas',
        'tagihan'           => 'Tagihan & Utilitas',
        'utilitas'          => 'Tagihan & Utilitas',
        'listrik'           => 'Tagihan & Utilitas',
        'electricity'       => 'Tagihan & Utilitas',
        'air'               => 'Tagihan & Utilitas',
        'water'             => 'Tagihan & Utilitas',
        'internet'          => 'Tagihan & Utilitas',
        'telepon'           => 'Tagihan & Utilitas',
        'phone'             => 'Tagihan & Utilitas',
        'pulsa'             => 'Tagihan & Utilitas',
        'pln'               => 'Tagihan & Utilitas',

        // Household
        'household'         => 'Rumah Tangga',
        'rumah tangga'      => 'Rumah Tangga',
        'home'              => 'Rumah Tangga',
        'rumah'             => 'Rumah Tangga',
        'furniture'         => 'Rumah Tangga',
        'perabot'           => 'Rumah Tangga',

        // Personal Care
        'personal care'     => 'Perawatan Diri',
        'perawatan diri'    => 'Perawatan Diri',
        'beauty'            => 'Perawatan Diri',
        'kecantikan'        => 'Perawatan Diri',
        'salon'             => 'Perawatan Diri',
        'barbershop'        => 'Perawatan Diri',
        'potong rambut'     => 'Perawatan Diri',

        // Insurance
        'insurance'         => 'Asuransi',
        'asuransi'          => 'Asuransi',

        // Subscription
        'subscription'      => 'Langganan',
        'langganan'         => 'Langganan',
        'streaming'         => 'Langganan',
        'netflix'           => 'Langganan',
        'spotify'           => 'Langganan',

        // Installment
        'installment'       => 'Cicilan',
        'cicilan'           => 'Cicilan',
        'kredit'            => 'Cicilan',
        'angsuran'          => 'Cicilan',
    ];

    /**
     * Map kategori DB → tag yang relevan (nama tag)
     */
    private const CATEGORY_TO_TAGS = [
        'Makanan & Minuman' => ['Kebutuhan'],
        'Transportasi'      => ['Kebutuhan'],
        'Belanja'           => ['Kebutuhan'],
        'Hiburan'           => ['Hobi'],
        'Kesehatan'         => ['Penting', 'Kebutuhan'],
        'Pendidikan'        => ['Penting'],
        'Tagihan & Utilitas'=> ['Bulanan', 'Kebutuhan'],
        'Rumah Tangga'      => ['Kebutuhan'],
        'Perawatan Diri'    => ['Pribadi'],
        'Asuransi'          => ['Bulanan', 'Penting'],
        'Langganan'         => ['Bulanan'],
        'Cicilan'           => ['Bulanan', 'Penting'],
        'Lainnya'           => [],
    ];

    public function __construct(
        protected string $raw_text,
        protected string $doc_type,
        protected int $document_id,
        protected ?int $userId = null
    ) {}

    public function getDocumentId(): int
    {
        return $this->document_id;
    }

    /**
     * Execute the job.
     */
    public function handle(LLMMapper $mapper, PromptBuilder $builder): void
    {
        $document = Document::findOrFail($this->document_id);

        $schema      = DocumentSchema::from($this->doc_type);
        $isTextInput = $document->mime_type === 'text/plain';

        $prompt = $builder->build(
            $this->raw_text,
            $schema->schema(),
            $schema->value,
            $isTextInput
        );

        $structuredData = $mapper->map($prompt, $this->userId);

        $document->update([
            'extracted_data' => $structuredData,
            'status'         => 'completed',
        ]);

        // Resolve amount (EXPENSE = 'amount', INVOICE/RECEIPT = 'total_amount')
        $amount = $structuredData['amount']
            ?? $structuredData['total_amount']
            ?? 0;

        // Notes berbeda tergantung sumber
        $notes = $document->mime_type === 'text/plain'
            ? ($structuredData['description'] ?? 'Generated from text input')
            : 'Generated from OCR: ' . ($document->original_filename ?? 'document');

        // Resolve category_id dari nama kategori yang dikembalikan LLM
        // Jika LLM tidak memberikan kategori, sistem akan scan raw_text langsung
        $categoryId = $this->resolveCategoryId(
            $structuredData['category'] ?? null,
            $this->userId,
            $this->raw_text  // fallback: scan teks asli jika LLM tidak return kategori
        );

        $transaction = \App\Models\Transaction::create([
            'user_id'        => $this->userId,
            'type'           => \App\Models\Transaction::TYPE_EXPENSE,
            'amount_raw'     => $amount,
            'tx_date'        => $structuredData['date'] ?? now()->format('Y-m-d'),
            'merchant'       => $structuredData['merchant_name'] ?? 'Unknown',
            'notes'          => $notes,
            'currency_id'    => 1,
            'account_id'     => 4,
            'status_id'      => 1,
            'category_id'    => $categoryId,
            'dynamic_fields' => [
                'document_id' => $this->document_id,
                'items'       => $structuredData['items'] ?? [],
            ],
        ]);

        // Attach tags berdasarkan kategori
        $this->attachTags($transaction, $categoryId, $this->userId);

        $document->update(['transaction_id' => $transaction->id]);

        Log::info("ProcessOCRResult completed for Document #{$this->document_id}: " .
            "tx_id={$transaction->id}, amount={$amount}, category_id={$categoryId}");
    }

    /**
     * Resolve category_id dari nama kategori (bahasa Inggris/Indonesia) yang dikirim LLM.
     * Jika LLM tidak memberikan kategori, fallback ke scan raw_text via CATEGORY_MAP.
     */
    protected function resolveCategoryId(?string $llmCategory, ?int $userId, string $rawText = ''): ?int
    {
        $normalized = strtolower(trim($llmCategory ?? ''));

        // 1. Scan CATEGORY_MAP: coba dari llmCategory dulu, lalu dari rawText jika kosong
        $textsToScan = array_filter([$normalized, strtolower($rawText)]);
        $mappedName  = null;

        foreach ($textsToScan as $text) {
            if (empty($text)) continue;
            foreach (self::CATEGORY_MAP as $keyword => $dbName) {
                if (Str::contains($text, $keyword)) {
                    $mappedName = $dbName;
                    break 2; // keluar dari kedua foreach
                }
            }
        }

        // 2. Jika tidak ada di map, coba exact/partial match llmCategory langsung ke DB
        if (!$mappedName && !empty($normalized)) {
            $direct = Category::where('tx_type', 'expense')
                ->where(function ($q) use ($normalized) {
                    $q->whereRaw('LOWER(name) = ?', [$normalized])
                      ->orWhereRaw('LOWER(name) LIKE ?', ["%{$normalized}%"]);
                })
                ->first();

            if ($direct) {
                return $direct->id;
            }
        }

        // 3. Cari berdasarkan mappedName di DB
        if ($mappedName) {
            $cat = Category::where('tx_type', 'expense')
                ->whereRaw('LOWER(name) = ?', [strtolower($mappedName)])
                ->first();

            if ($cat) {
                return $cat->id;
            }
        }

        // 4. Fallback ke 'Lainnya'
        $fallback = Category::where('tx_type', 'expense')
            ->whereRaw('LOWER(name) = ?', ['lainnya'])
            ->first();

        return $fallback?->id;
    }

    /**
     * Attach tags ke transaksi berdasarkan kategori yang terdeteksi.
     * Hanya attach tag milik user yang sudah ada di DB.
     */
    protected function attachTags(\App\Models\Transaction $transaction, ?int $categoryId, ?int $userId): void
    {
        if (!$categoryId || !$userId) {
            return;
        }

        $category = Category::find($categoryId);
        if (!$category) {
            return;
        }

        $tagNames = self::CATEGORY_TO_TAGS[$category->name] ?? [];
        if (empty($tagNames)) {
            return;
        }

        // Cari tag milik user yang namanya cocok
        $tagIds = Tag::where('user_id', $userId)
            ->whereIn('name', $tagNames)
            ->pluck('id')
            ->toArray();

        if (!empty($tagIds)) {
            $transaction->tags()->sync($tagIds);
            Log::info("Attached tags " . implode(',', $tagIds) . " to Transaction #{$transaction->id}");
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        Document::where('id', $this->document_id)->update([
            'status'        => 'failed',
            'error_message' => $exception->getMessage(),
        ]);

        Log::error("ProcessOCRResult failed for Document #{$this->document_id}: " . $exception->getMessage());
    }
}
