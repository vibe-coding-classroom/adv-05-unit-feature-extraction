# Canny Edge Detection Tuning Log

Record your optimal parameters for different environment conditions here.

| Condition | Threshold 1 | Threshold 2 | Blur Kernel Size | Notes |
|-----------|-------------|-------------|------------------|-------|
| Standard  |             |             |                  |       |
| Low Light |             |             |                  |       |
| Noisy Bg  |             |             |                  |       |

## Engineering Insights
- Why is `GaussianBlur` necessary before `Canny`?
- How did you handle "False Alarms" in the noisy background?
