<?php

use App\Models\User;
use App\Models\Document;
use App\Http\Controllers\DocumentExtractionController;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

// 1. Setup
$user = User::first();
auth()->login($user);

$filePath = '/Users/macbook/Documents/visatamora/apps/ocr/tests/samples/receipt.pdf';
$file = new UploadedFile($filePath, 'receipt.pdf', 'application/pdf', null, true);

$request = Request::create('/api/documents/upload', 'POST', [
    'doc_type' => 'receipt'
], [], ['file' => $file]);

echo "Starting Upload...\n";

// 2. Call Controller
$controller = app(DocumentExtractionController::class);
$response = $controller->upload($request);

echo "Upload Response: " . $response->getContent() . "\n";

$data = json_decode($response->getContent(), true);
$docId = $data['document_id'];

echo "Document ID: $docId. Waiting for Queue to process...\n";

// 3. Wait for process
$timeout = 30; // 30 seconds
$start = time();

while (time() - $start < $timeout) {
    $doc = Document::find($docId);
    if ($doc->status === 'completed') {
        echo "SUCCESS! Extracted Data:\n";
        print_r($doc->extracted_data);
        exit(0);
    } elseif ($doc->status === 'failed') {
        echo "FAILED! Error: " . $doc->error_message . "\n";
        exit(1);
    }
    echo ".";
    sleep(2);
}

echo "TIMEOUT! Process took too long.\n";
exit(1);
