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

        // PRE-DETECTION: Only log potential type mismatch, don't override doc_type yet
        // to avoid sending the wrong schema if the detection is a false positive.
        $isIncomePattern = preg_match('/\b(gaji|salary|income|thr|bonus|investasi|profit)\b/i', $this->raw_text);
        if ($this->doc_type === 'expense' && $isIncomePattern) {
            Log::info("Potential INCOME detected for Document #{$this->document_id} via pattern matching.");
        }

        $schema      = DocumentSchema::from($this->doc_type);
        $isTextInput = $document->mime_type === 'text/plain';

        // Sanitize raw_text: Hapus titik di antara angka (thousand separator) 
        // agar LLM tidak salah sangka sebagai decimal point.
        // Contoh: "10.000" -> "10000"
        $this->raw_text = preg_replace('/(\d)\.(\d{3})\b/', '$1$2', $this->raw_text);
        $this->raw_text = preg_replace('/(\d)\.(\d)/', '$1$2', $this->raw_text);

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

        // Resolve amount (EXPENSE = 'amount', INVOICE/RECEIPT = 'total_amount', AUDIO = 0)
        $amount = $structuredData['amount']
            ?? $structuredData['total_amount']
            ?? 0;

        // NEW: Jika ada data items, kita hitung ulang total amount di sisi server
        // untuk menghindari kesalahan hitung (halusinasi) dari LLM.
        if (!empty($structuredData['items']) && is_array($structuredData['items'])) {
            $sumOfItems = 0;
            $hasValidPrices = false;
            foreach ($structuredData['items'] as $item) {
                if (isset($item['price']) && is_numeric($item['price'])) {
                    $itemPrice = (float) $item['price'];
                    
                    // SAFETY: Jika angka sangat kecil (misal 10.0) padahal ada kata "ribu"
                    // di teks asli, kita kalikan 1000.
                    if ($itemPrice < 1000 && str_contains(strtolower($this->raw_text), 'ribu')) {
                        $itemPrice *= 1000;
                    }
                    
                    $sumOfItems += (int) $itemPrice;
                    $hasValidPrices = true;
                }
            }
            // Gunakan hasil penjumlahan server jika ditemukan harga yang valid
            if ($hasValidPrices && $sumOfItems > 0) {
                $amount = $sumOfItems;
            }
        }

        // Notes berformat JSON standar, key menyesuaikan sumber tracker
        $notes = $this->buildTrackerNotes($document, $structuredData);

        // Resolve merchant name — berbeda per schema
        $merchant = $structuredData['merchant_name']   // EXPENSE / RECEIPT
            ?? $structuredData['source_name']           // INCOME
            ?? $structuredData['vendor_name']           // INVOICE
            ?? $structuredData['speaker_name']          // AUDIO_NOTE
            ?? (isset($structuredData['summary'])
                ? mb_strimwidth($structuredData['summary'], 0, 50, '...')
                : null)
            ?? 'Unknown';

        // Jika merchant tetap Unknown (case-insensitive) tapi ada data items, gunakan item pertama
        if (strtolower($merchant) === 'unknown' && !empty($structuredData['items'][0]['name'])) {
            $merchant = $structuredData['items'][0]['name'];
        }

        // Resolve transaction type (Priority: LLM Result -> User Selection -> Manual Detection)
        $txType = $structuredData['type'] ?? null;
        $extractedCategory = $structuredData['category'] ?? '';

        // Validasi txType dari LLM
        if (!in_array($txType, [\App\Models\Transaction::TYPE_INCOME, \App\Models\Transaction::TYPE_EXPENSE])) {
            $incomeKeywords = [
                'Salary', 'Bonus', 'Freelance', 'Investment', 'Gift', 'Sales', 'Other Income',
                'Gaji', 'Bonus', 'Proyek', 'Investasi', 'Hadiah', 'Penjualan', 'Pendapatan', 'THR'
            ];
            
            // Manual detection as fallback
            $isIncomeDetected = in_array(Str::title($extractedCategory), $incomeKeywords) 
                || preg_match('/\b(gaji|salary|income|thr|bonus|investasi|profit)\b/i', $this->raw_text);

            $txType = $isIncomeDetected ? \App\Models\Transaction::TYPE_INCOME : $this->doc_type;
        }

        // Resolve category_id dari nama kategori yang dikembalikan LLM
        // Jika LLM tidak memberikan kategori, sistem akan scan raw_text langsung
        $categoryId = $this->resolveCategoryId(
            $extractedCategory,
            $this->userId,
            $txType,         // NEW: Pass txType to filter correct categories
            $this->raw_text  // fallback: scan teks asli jika LLM tidak return kategori
        );

        // Resolve tracker source type
        $trackerSource = $this->resolveTrackerSource($document);

        $transaction = \App\Models\Transaction::create([
            'user_id'        => $this->userId,
            'type'           => $txType,
            'amount_raw'     => $amount,
            'tx_date'        => $structuredData['date'] ?? now()->format('Y-m-d'),
            'tracker'        => $trackerSource,
            'merchant'       => $merchant,
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
    protected function resolveCategoryId(?string $llmCategory, ?int $userId, string $txType, string $rawText = ''): ?int
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
            $direct = Category::where('tx_type', $txType)
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
            $cat = Category::where('tx_type', $txType)
                ->whereRaw('LOWER(name) = ?', [strtolower($mappedName)])
                ->first();

            if ($cat) {
                return $cat->id;
            }
        }

        // 4. Fallback ke 'Lainnya' / 'Pendapatan Lainnya' berdasarkan tipe transaksi
        $fallbackName = $txType === \App\Models\Transaction::TYPE_INCOME ? 'pendapatan lainnya' : 'lainnya';
        $fallback = Category::where('tx_type', $txType)
            ->whereRaw('LOWER(name) = ?', [$fallbackName])
            ->first();

        // Second fallback: just get the first one from this type if even fallback doesn't exist
        if (!$fallback) {
            $fallback = Category::where('tx_type', $txType)->first();
        }

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
     * Bangun string notes berformat list rapi (Mie Ayam = 10000).
     */
    protected function buildTrackerNotes(Document $document, array $structuredData): string
    {
        $items = $structuredData['items'] ?? [];
        $noteLines = [];

        foreach ($items as $item) {
            $name = $item['name'] ?? 'Item Tanpa Nama';
            $price = $item['price'] ?? 0;
            
            // Rapikan format: Huruf Kapital di awal kata
            $name = ucwords(strtolower($name));
            
            $noteLines[] = "- {$name} = {$price}";
        }

        // Tambahkan deskripsi dari AI jika ada
        if (!empty($structuredData['description'])) {
            if (!empty($noteLines)) {
                $noteLines[] = ""; // Spasi pemisah
            }
            $noteLines[] = "Info: " . $structuredData['description'];
        }

        return implode("\n", $noteLines);
    }

    /**
     * Tentukan sumber tracker (manual, image, file, audio) berdasarkan dokumen.
     */
    protected function resolveTrackerSource(Document $document): string
    {
        $mime = $document->mime_type ?? '';
        $audioExtensions = ['webm', 'ogg', 'mp3', 'wav', 'm4a', 'aac', 'flac', 'opus'];
        $fileExt = strtolower(pathinfo($document->original_filename ?? '', PATHINFO_EXTENSION));

        return match (true) {
            $mime === 'text/plain'                                    => 'manual',
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
        Document::where('id', $this->document_id)->update([
            'status'        => 'failed',
            'error_message' => $exception->getMessage(),
        ]);

        Log::error("ProcessOCRResult failed for Document #{$this->document_id}: " . $exception->getMessage());
    }
}
