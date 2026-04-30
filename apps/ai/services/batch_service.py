import uuid

class BatchService:
    def __init__(self):
        # In-memory storage for batches: batch_id -> {status, results, total, completed}
        self.batches = {}

    def create_batch(self, total_files: int) -> str:
        batch_id = str(uuid.uuid4())
        self.batches[batch_id] = {
            "id": batch_id,
            "status": "processing",
            "results": [],
            "total": total_files,
            "completed": 0
        }
        return batch_id

    def add_result(self, batch_id: str, result: dict):
        if batch_id in self.batches:
            self.batches[batch_id]["results"].append(result)
            self.batches[batch_id]["completed"] += 1
            if self.batches[batch_id]["completed"] == self.batches[batch_id]["total"]:
                self.batches[batch_id]["status"] = "completed"

    def get_batch(self, batch_id: str) -> dict:
        return self.batches.get(batch_id)

    def delete_batch(self, batch_id: str) -> bool:
        if batch_id in self.batches:
            del self.batches[batch_id]
            return True
        return False

# Singleton instance
batch_service = BatchService()
