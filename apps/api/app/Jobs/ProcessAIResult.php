<?php

namespace App\Jobs;

use App\Enums\DocumentSchema;
use App\Enums\DocumentStatus;
use App\Models\Account;
use App\Models\Category;
use App\Models\DocumentExtraction;
use App\Models\Status;
use App\Models\Currency;
use App\Models\Tag;
use App\Models\Transaction;
use App\Models\User;
use App\Notifications\TrackerProcessedNotification;
use App\Services\LLMMapper;
use App\Services\PromptBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;
use Throwable;

class ProcessAIResult implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;
    public array $backoff = [10, 30, 60, 120];
    public int $timeout = 180;

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
        'kaffe'             => 'Makanan & Minuman',

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

        // Income Categories
        'salary'            => 'Gaji',
        'gaji'              => 'Gaji',
        'bonus'             => 'Bonus',
        'thr'               => 'Bonus',
        'freelance'         => 'Freelance',
        'proyek'            => 'Freelance',
        'side job'          => 'Freelance',
        'investment'        => 'Investasi',
        'investasi'         => 'Investasi',
        'gift'              => 'Hadiah',
        'hadiah'            => 'Hadiah',
        'sales'             => 'Penjualan',
        'jualan'            => 'Penjualan',
        'other income'      => 'Pendapatan Lainnya',
        'pendapatan'        => 'Pendapatan Lainnya',
        'income'            => 'Pendapatan Lainnya',
        'electronic'        => 'Belanja',
        'electronics'       => 'Belanja',
        'gadget'            => 'Belanja',
        'marketplace'       => 'Belanja',
        'ecommerce'         => 'Belanja',
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
        protected string $document_id,
        protected ?string $userId = null
    ) {}

    public function getDocumentId(): string
    {
        return $this->document_id;
    }

    /**
     * Execute the job.
     */
    public function handle(LLMMapper $mapper, PromptBuilder $builder): void
    {
        $document = DocumentExtraction::findOrFail($this->document_id);

        $schema      = DocumentSchema::from($this->doc_type);
        $isTextInput = $document->mime_type === 'text/plain';

        // Sanitize raw_text: Hapus titik di antara angka (thousand separator) 
        // agar LLM tidak salah sangka sebagai decimal point.
        $this->raw_text = preg_replace('/(\d)\.(\d{3})\b/', '$1$2', $this->raw_text);

        $prompt = $builder->build(
            $this->raw_text,
            $schema->schema(),
            $schema->value,
            $isTextInput
        );

        $structuredData = $mapper->map($prompt, $this->userId);

        $document->update([
            'parsed_data' => $structuredData,
        'status'         => DocumentStatus::COMPLETED->value,
        ]);

        // Support for multiple transactions in one document
        $createdTransactionIds = [];
        $txArray = $structuredData['tx'] ?? $structuredData['transactions'] ?? [];
        if (is_array($txArray)) {
            foreach ($txArray as $data) {
                try {
                    $transaction = $this->processTransaction($data, $document);
                    if ($transaction) {
                        $createdTransactionIds[] = $transaction->id;
                    }
                } catch (Exception $e) {
                    Log::error("Failed to process individual transaction in Document #{$this->document_id}: " . $e->getMessage());
                }
            }
        }

        // Send success notification
        if ($this->userId) {
            $user = User::find($this->userId);
            if ($user) {
                $count = count($createdTransactionIds);
                $msg = $count > 0 
                    ? "Berhasil menambahkan {$count} transaksi dari dokumen Anda."
                    : "Dokumen berhasil diproses, namun tidak ada transaksi yang terdeteksi.";
                
                $user->notify(new TrackerProcessedNotification(
                    'success',
                    'Tracker Berhasil Diproses',
                    $msg,
                    ['document_id' => $document->id, 'transaction_ids' => $createdTransactionIds]
                ));
            }
        }

        Log::info("ProcessAIResult completed for Document #{$this->document_id}: Created " . count($createdTransactionIds) . " transactions.");
    }

    /**
     * Process and save a single transaction from extracted data.
     */
    protected function processTransaction(array $data, DocumentExtraction $document): ?Transaction
    {
        $merchant = $data['merchant'] ?? $data['m'] ?? $data['merchant_name'] ?? $data['source'] ?? $data['s'] ?? $data['source_name'] ?? $data['vendor_name'] ?? $data['speaker_name'] ?? $data['payer'] ?? $data['recipient'] ?? 'Unknown';
        $amount   = $data['amount'] ?? $data['a'] ?? $data['total_amount'] ?? 0;
        $txType   = $data['type'] ?? $data['t'] ?? Transaction::TYPE_EXPENSE;
        $notes    = $data['description'] ?? $data['desc'] ?? null;
        $extractedCategory = $data['category'] ?? $data['c'] ?? '';

        // NEW: Jika ada data items, kita hitung ulang total amount di sisi server
        if (!empty($data['items']) && is_array($data['items'])) {
            $sumOfItems = 0;
            $hasValidPrices = false;
            foreach ($data['items'] as $item) {
                if (isset($item['price']) && is_numeric($item['price'])) {
                    $itemPrice = (float) $item['price'];
                    
                    if ($itemPrice < 1000 && str_contains(strtolower($this->raw_text), 'ribu')) {
                        $itemPrice *= 1000;
                    }
                    $sumOfItems += (int) $itemPrice;
                    $hasValidPrices = true;
                }
            }
            if ($amount <= 0 && $hasValidPrices && $sumOfItems > 0) {
                $amount = $sumOfItems;
            }
        }

        // Notes berformat JSON standar, key menyesuaikan sumber tracker
        $notes = $this->buildTrackerNotes($document, $data);

        $merchantLower = strtolower($merchant);
        if (($merchantLower === 'unknown' || $merchantLower === 'unspecified') && !empty($data['items'][0]['name'])) {
            $merchant = ucwords(strtolower($data['items'][0]['name']));
        } else if ($merchantLower === 'unspecified') {
            $merchant = 'Lain-lain';
        }

        // Resolve transaction type
        if (!in_array($txType, [Transaction::TYPE_INCOME, Transaction::TYPE_EXPENSE])) {
            $incomeKeywords = [
                'Salary', 'Bonus', 'Freelance', 'Investment', 'Gift', 'Sales', 'Other Income',
                'Gaji', 'Bonus', 'Proyek', 'Investasi', 'Hadiah', 'Penjualan', 'Pendapatan', 'THR'
            ];
            
            $isIncomeDetected = in_array(Str::title($extractedCategory), $incomeKeywords) 
                || preg_match('/\b(gaji|salary|income|thr|bonus|investasi|profit)\b/i', $this->raw_text);

            $txType = $isIncomeDetected ? Transaction::TYPE_INCOME : Transaction::TYPE_EXPENSE;
        }

        // Resolve category_id
        $categoryId = $this->resolveCategoryId(
            $extractedCategory,
            $this->userId,
            $txType,
            $this->raw_text
        );

        // Resolve tracker source type
        $trackerSource = $this->resolveTrackerSource($document);

        // Resolve account_id (Ambil akun pertama, jika kosong otomatis buat "Dompet")
        $account = Account::where('user_id', $this->userId)->first();

        // Auto-create default account if user has none
        if (!$account) {
            $currencyId = Currency::where('code', 'IDR')->first()?->id ?? Currency::first()?->id;
            $account = Account::create([
                'user_id'      => $this->userId,
                'name'         => 'Dompet',
                'account_type' => 'cash',
                'currency_id'  => $currencyId,
                'color'        => '#3498db',
            ]);
            Log::info("Auto-created default account 'Dompet' for User #{$this->userId}");
        }
        
        $accountId = $account->id;

        $currencyId = Currency::where('code', 'IDR')->first()?->id ?? Currency::first()?->id;
        $statusId = Status::where('name', 'Completed')->first()?->id ?? Status::first()?->id;

        $transaction = Transaction::create([
            'user_id'                => $this->userId,
            'type'                   => $txType,
            'amount'                 => (float) preg_replace('/[^0-9.]/', '', str_replace(',', '.', (string)$amount)),
            'tx_date'                => $data['date'] ?? now()->format('Y-m-d'),
            'input_method'           => $trackerSource,
            'merchant'               => $merchant,
            'notes'                  => $notes,
            'currency_id'            => $currencyId,
            'account_id'             => $accountId,
            'status_id'              => $statusId,
            'category_id'            => $categoryId,
            'document_extraction_id' => $document->id,
            'dynamic_fields'         => [
                'items'       => $data['items'] ?? [],
            ],
        ]);

        // Attach tags
        $this->attachTags($transaction, $categoryId, $this->userId);

        return $transaction;
    }


    /**
     * Resolve category_id dari nama kategori (bahasa Inggris/Indonesia) yang dikirim LLM.
     * Jika LLM tidak memberikan kategori, fallback ke scan raw_text via CATEGORY_MAP.
     */
    protected function resolveCategoryId(?string $llmCategory, ?string $userId, string $txType, string $rawText = ''): ?string
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
            $direct = Category::where('type', $txType)
                ->where(function ($q) use ($normalized) {
                    $q->whereRaw('LOWER(name) = ?', [$normalized])
                      ->orWhereRaw('LOWER(name) LIKE ?', ["%{$normalized}%"]);
                })
                ->first();

            if ($direct) {
                return (string)$direct->id;
            }
        }

        // 3. Cari berdasarkan mappedName di DB
        if ($mappedName) {
            $cat = Category::where('type', $txType)
                ->whereRaw('LOWER(name) = ?', [strtolower($mappedName)])
                ->first();

            if ($cat) {
                return (string)$cat->id;
            }
        }

        // 4. Fallback ke 'Lainnya' / 'Pendapatan Lainnya' berdasarkan tipe transaksi
        $fallbackName = $txType === Transaction::TYPE_INCOME ? 'pendapatan lainnya' : 'lainnya';
        $fallback = Category::where('type', $txType)
            ->whereRaw('LOWER(name) = ?', [$fallbackName])
            ->first();

        // Second fallback: just get the first one from this type if even fallback doesn't exist
        if (!$fallback) {
            $fallback = Category::where('type', $txType)->first();
        }

        return $fallback ? (string)$fallback->id : null;
    }

    /**
     * Attach tags ke transaksi berdasarkan kategori yang terdeteksi.
     * Hanya attach tag milik user yang sudah ada di DB.
     */
    protected function attachTags(Transaction $transaction, ?string $categoryId, ?string $userId): void
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
     * Bangun string notes berformat list rapi (Mie Ayam = 10000).
     */
    protected function buildTrackerNotes(DocumentExtraction $document, array $data): string
    {
        $items = $data['items'] ?? [];
        $noteLines = [];

        foreach ($items as $item) {
            $name = $item['name'] ?? 'Item Tanpa Nama';
            $price = $item['price'] ?? 0;
            
            // Rapikan format: Huruf Kapital di awal kata
            $name = ucwords(strtolower($name));
            
            $noteLines[] = "- {$name} = {$price}";
        }

        // Tambahkan deskripsi dari AI jika ada
        if (!empty($data['description'])) {
            if (!empty($noteLines)) {
                $noteLines[] = ""; // Spasi pemisah
            }
            $noteLines[] = "Info: " . $data['description'];
        }

        return implode("\n", $noteLines);
    }


    /**
     * Tentukan sumber tracker (manual, image, file, audio) berdasarkan dokumen.
     */
    protected function resolveTrackerSource(DocumentExtraction $document): string
    {
        $mime = $document->mime_type ?? '';
        $filename = $document->original_filename ?? '';
        $audioExtensions = ['webm', 'ogg', 'mp3', 'wav', 'm4a', 'aac', 'flac', 'opus'];
        $fileExt = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        return match (true) {
            $mime === 'text/plain'                                    => 'manual',
            str_starts_with($filename, 'scan-')                      => 'image', // changed scan to image for input_method
            str_starts_with($mime, 'audio/')                         => 'audio',
            in_array($mime, ['video/webm', 'video/mp4'], true)       => 'audio',
            in_array($fileExt, $audioExtensions, true)               => 'audio',
            str_starts_with($mime, 'image/')                         => 'image',
            default                                                   => 'file',
        };
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        $document = DocumentExtraction::find($this->document_id);
        if ($document) {
            $document->update([
                'status'        => DocumentStatus::FAILED->value,
                'error_message' => $exception->getMessage(),
            ]);

            if ($this->userId) {
                $user = User::find($this->userId);
                if ($user) {
                    $user->notify(new TrackerProcessedNotification(
                        'error',
                        'Gagal Memproses Data AI',
                        "Terjadi kesalahan saat mengolah data transaksi: " . $exception->getMessage(),
                        ['document_id' => $document->id]
                    ));
                }
            }
        }

        Log::error("ProcessAIResult failed for Document #{$this->document_id}: " . $exception->getMessage());
    }
}
