<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Notifications\DatabaseNotification;

class NotificationService
{
    /**
     * List user notifications with filtering.
     */
    public static function list(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = $user->notifications();

        if (!empty($filters['filter'])) {
            $filter = strtolower($filters['filter']);
            
            $query = match ($filter) {
                'all' => $query,
                'unread' => $query->whereNull('read_at'),
                'starred' => $query->where('is_starred', true),
                'archive' => $query->whereNotNull('read_at'),
                default => in_array($filter, ['budgeting', 'saving', 'credit', 'expense', 'income']) 
                    ? $query->where('label', $filter) 
                    : $query,
            };
        }

        return $query->latest()->paginate($filters['per_page'] ?? 20);
    }

    /**
     * Mark a specific notification as read.
     */
    public static function markAsRead(User $user, string $id): void
    {
        $user->notifications()->findOrFail($id)->markAsRead();
    }

    /**
     * Mark all notifications as read.
     */
    public static function markAllAsRead(User $user): void
    {
        $user->unreadNotifications->markAsRead();
    }

    /**
     * Toggle starred status.
     */
    public static function toggleStar(User $user, string $id): bool
    {
        $notification = $user->notifications()->findOrFail($id);
        $newStatus = !$notification->is_starred;
        
        $notification->forceFill(['is_starred' => $newStatus])->save();
        
        return $newStatus;
    }

    /**
     * Delete notification.
     */
    public static function destroy(User $user, string $id): void
    {
        $user->notifications()->findOrFail($id)->delete();
    }
}
