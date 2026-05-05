# Class Diagram - Fitur Tracker (Transaction)

Diagram Kelas ini merepresentasikan struktur ideal (Best Practice) pada *backend* Laravel untuk mengelola fitur Tracker (Transaction). Alih-alih sekadar menyalin struktur *database* ERD, diagram ini menunjukkan interaksi antara komponen MVC (Controller, Service Layer, dan Eloquent Models) yang berfokus penuh pada entitas `Transaction`.

```mermaid
classDiagram
  class User {
    +UUID id
    +String name
    +String email
    +String role
    +Timestamp created_at
  }

  class Account {
    +UUID id
    +UUID user_id
    +String name
    +String account_type
    +UUID currency_id
    +String color
    +Timestamp created_at
    +Timestamp updated_at
  }

  class Currency {
    +UUID id
    +String code
    +String name
    +String symbol
  }

  class Category {
    +UUID id
    +UUID user_id
    +UUID parent_id
    +String name
    +String type
    +String icon
    +String color
  }

  class Tag {
    +UUID id
    +UUID user_id
    +String name
    +String color
  }

  class Status {
    +UUID id
    +String name
    +String color
  }

  class RecurringType {
    +UUID id
    +String name
  }

  class Transaction {
    +UUID id
    +UUID user_id
    +String type
    +Bigint amount_raw
    +UUID currency_id
    +Float exchange_rate
    +Float amount_in_default
    +UUID account_id
    +UUID to_account_id
    +UUID category_id
    +UUID status_id
    +UUID recurring_type_id
    +UUID document_extraction_id
    +Date tx_date
    +String input_method
    +String merchant
    +Text notes
    +JSON dynamic_fields
    +Timestamp created_at
    +Timestamp updated_at
  }

  class TransactionTag {
    +UUID transaction_id
    +UUID tag_id
  }

  class DocumentExtraction {
    +UUID id
    +UUID user_id
    +UUID transaction_id
    +String document_type
    +String file_path
    +String mime_type
    +String original_filename
    +Text raw_text
    +JSON parsed_data
    +String status
    +Text error_message
    +Timestamp created_at
    +Timestamp updated_at
  }

  class LLMProvider {
    +UUID id
    +UUID user_id
    +String name
    +String base_url
    +Text api_key
    +String default_model
    +Boolean is_active
    +Int priority
    +Boolean is_default
  }

  %% Relations
  User "1" --> "many" Account : owns
  User "1" --> "many" Transaction : makes
  User "1" --> "many" Category : owns
  User "1" --> "many" Tag : owns
  User "1" --> "many" DocumentExtraction : owns

  Account "1" --> "many" Transaction : source
  Currency "1" --> "many" Account : used_in
  Currency "1" --> "many" Transaction : used_in

  Category "1" --> "many" Transaction : categorizes
  Status "1" --> "many" Transaction : assigns
  RecurringType "1" --> "many" Transaction : assigns

  Transaction "1" --> "many" TransactionTag : tagged_with
  Tag "1" --> "many" TransactionTag : labels
  Transaction "1" --> "0..1" DocumentExtraction : sourced_from

  DocumentExtraction "1" ..> "1" LLMProvider : processed_by
```
