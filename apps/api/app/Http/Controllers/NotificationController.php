<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    /**
     * Get user notifications.
     */
    public function index(Request $request)
    {
        $query = $request->user()->notifications();

        if ($request->has('filter')) {
            $filter = $request->get('filter');
            if ($filter === 'unread') {
                $query->whereNull('read_at');
            } elseif ($filter === 'starred') {
                $query->where('is_starred', true);
            } elseif ($filter === 'archive') {
                $query->whereNotNull('read_at');
            } elseif (in_array(strtolower($filter), ['budgeting', 'saving', 'credit', 'expense', 'income'])) {
                $query->where('label', strtolower($filter));
            }
        }

        $notifications = $query->latest()
            ->paginate($request->input('per_page', 20));

        return response()->json($notifications);
    }

    /**
     * Get unread notifications count.
     */
    public function unreadCount(Request $request)
    {
        return response()->json([
            'unread_count' => $request->user()->unreadNotifications()->count()
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read.']);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    /**
     * Toggle starred status of a notification.
     */
    public function toggleStar(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->findOrFail($id);

        $notification->forceFill(['is_starred' => !$notification->is_starred])->save();

        return response()->json(['message' => 'Notification starred status updated.', 'is_starred' => $notification->is_starred]);
    }

    /**
     * Delete a notification.
     */
    public function destroy(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->findOrFail($id);

        $notification->delete();

        return response()->json(['message' => 'Notification deleted.']);
    }
}
