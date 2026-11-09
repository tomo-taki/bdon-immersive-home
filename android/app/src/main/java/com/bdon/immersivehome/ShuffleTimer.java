package com.bdon.immersivehome;

/** Owns the engine's single interval callback. */
final class ShuffleTimer {
    enum Visibility { HIDDEN, VISIBLE }

    interface Queue {
        void post(Runnable task, long delayMs);
        void remove(Runnable task);
    }

    private final Queue queue;
    private final Runnable action;
    private Runnable current;
    private Visibility visibility = Visibility.HIDDEN;

    ShuffleTimer(Queue queue, Runnable action) {
        this.queue = queue;
        this.action = action;
    }

    void setVisibility(Visibility value) {
        visibility = value;
        if (value == Visibility.HIDDEN) {
            stop();
        }
    }

    void schedule(long delayMs) {
        stop();
        if (visibility == Visibility.HIDDEN) {
            return;
        }

        current = new Runnable() {
            @Override public void run() {
                if (current != this) {
                    return;
                }

                action.run();
                // A preference callback can replace or stop this timer mid-tick.
                if (current == this) {
                    queue.post(this, delayMs);
                }
            }
        };
        queue.post(current, delayMs);
    }

    void stop() {
        if (current != null) {
            queue.remove(current);
        }
        current = null;
    }
}
