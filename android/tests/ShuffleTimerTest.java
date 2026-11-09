package com.bdon.immersivehome;

import java.util.ArrayList;
import java.util.List;

final class ShuffleTimerTest {
    private static final long PERIOD_MS = 60_000L;

    private static final class Queue implements ShuffleTimer.Queue {
        private final List<Runnable> pending = new ArrayList<>();

        @Override public void post(Runnable task, long delayMs) {
            if (delayMs != PERIOD_MS) {
                throw new AssertionError("wrong interval: " + delayMs);
            }
            pending.add(task);
        }

        @Override public void remove(Runnable task) {
            pending.removeIf(value -> value == task);
        }

        private void tick() {
            pending.remove(0).run();
        }

        private void expect(int count, String message) {
            if (pending.size() != count) {
                throw new AssertionError(message + ": " + pending.size());
            }
        }
    }

    private static void reentrantSchedule() {
        Queue queue = new Queue();
        ShuffleTimer[] timer = new ShuffleTimer[1];
        timer[0] = new ShuffleTimer(queue, () -> timer[0].schedule(PERIOD_MS));
        timer[0].setVisibility(ShuffleTimer.Visibility.VISIBLE);
        timer[0].schedule(PERIOD_MS);
        queue.tick();
        queue.expect(1, "preference callback duplicated timer");
        timer[0].stop();
        queue.expect(0, "old callback survived stop");
    }

    private static void stopInCallback() {
        Queue queue = new Queue();
        ShuffleTimer[] timer = new ShuffleTimer[1];
        timer[0] = new ShuffleTimer(queue, () -> timer[0].stop());
        timer[0].setVisibility(ShuffleTimer.Visibility.VISIBLE);
        timer[0].schedule(PERIOD_MS);
        queue.tick();
        queue.expect(0, "stopped callback rearmed itself");
    }

    private static void hiddenEngine() {
        Queue queue = new Queue();
        ShuffleTimer timer = new ShuffleTimer(queue, () -> {});
        timer.schedule(PERIOD_MS);
        queue.expect(0, "new hidden engine scheduled a timer");
        timer.setVisibility(ShuffleTimer.Visibility.VISIBLE);
        timer.schedule(PERIOD_MS);
        queue.tick();
        queue.expect(1, "visible engine lost its interval");
        timer.setVisibility(ShuffleTimer.Visibility.HIDDEN);
        timer.schedule(PERIOD_MS);
        queue.expect(0, "settings broadcast rearmed hidden engine");
    }

    public static void main(String[] args) {
        int failures = 0;
        for (Runnable test : List.<Runnable>of(
                ShuffleTimerTest::reentrantSchedule,
                ShuffleTimerTest::stopInCallback,
                ShuffleTimerTest::hiddenEngine)) {
            try {
                test.run();
            } catch (AssertionError error) {
                failures++;
                System.err.println(error.getMessage());
            }
        }
        if (failures != 0) {
            throw new AssertionError(failures + " timer regressions");
        }
        System.out.println("Shuffle timer: reentry, cancellation, visibility passed");
    }
}
