<?php

namespace App\Http\Controllers;

use App\Data\NotificationData;
use App\Http\Requests\ListNotificationRequest;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\DataCollection;

class NotificationController extends Controller
{
    /**
     * Get user notifications.
     */
    public function index(ListNotificationRequest $request): JsonResponse
    {
        $notifications = NotificationService::list(
            $request->user(), 
            $request->validated()
        );

        return response()->json([
            'data' => NotificationData::collect($notifications, DataCollection::class),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ]
        ]);
    }

    /**
     * Get unread notifications count.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'unread_count' => $request->user()->unreadNotifications()->count()
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, $id): JsonResponse
    {
        NotificationService::markAsRead($request->user(), $id);

        return response()->json(['message' => 'Notification marked as read.']);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        NotificationService::markAllAsRead($request->user());

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    /**
     * Toggle starred status of a notification.
     */
    public function toggleStar(Request $request, $id): JsonResponse
    {
        $isStarred = NotificationService::toggleStar($request->user(), $id);

        return response()->json([
            'message' => 'Notification starred status updated.', 
            'is_starred' => $isStarred
        ]);
    }

    /**
     * Delete a notification.
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        NotificationService::destroy($request->user(), $id);

        return response()->json(['message' => 'Notification deleted.']);
    }
}
