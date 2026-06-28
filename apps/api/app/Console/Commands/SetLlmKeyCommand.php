<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\LlmProvider;

#[Signature('llm:set-key {provider} {api_key} {--user=} {--default}')]
#[Description('Set the API key for an LLM provider')]
class SetLlmKeyCommand extends Command
{
    
    public function handle()
    {
        $providerName = $this->argument('provider');
        $apiKey = $this->argument('api_key');
        $userId = $this->option('user');
        $isDefault = $this->option('default');

        if ($isDefault && $userId) {
            $this->error('A default provider cannot belong to a specific user.');
            return Command::FAILURE;
        }

        $provider = LlmProvider::where('name', $providerName)
            ->where('user_id', $userId)
            ->first();

        if ($provider) {
            $provider->update([
                'api_key' => $apiKey,
                'is_default' => $isDefault ? true : $provider->is_default,
                'last_rotated_at' => now(),
            ]);
            $this->info("Updated API key for existing provider: {$providerName}");
        } else {
            
            $this->error("Provider {$providerName} not found. Please insert it manually with full payload_template first.");
            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
