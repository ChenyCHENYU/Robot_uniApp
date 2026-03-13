/**
 * useCountdown - 倒计时
 *
 * @example
 * const { seconds, counting, start, reset } = useCountdown(60)
 * start() // 开始倒计时
 */
import { ref, onUnmounted } from "vue";

export function useCountdown(initialSeconds = 60) {
  const seconds = ref(0);
  const counting = ref(false);
  let timer = null;

  const start = (duration = initialSeconds) => {
    if (counting.value) return;
    seconds.value = duration;
    counting.value = true;
    timer = setInterval(() => {
      seconds.value--;
      if (seconds.value <= 0) {
        stop();
      }
    }, 1000);
  };

  const stop = () => {
    counting.value = false;
    seconds.value = 0;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const reset = () => {
    stop();
  };

  onUnmounted(() => {
    stop();
  });

  return { seconds, counting, start, stop, reset };
}
