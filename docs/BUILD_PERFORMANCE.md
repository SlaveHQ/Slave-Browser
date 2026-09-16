# Slave Browser Build Performance

These benchmarks reflect the performance on the standard 16GB RAM, CPU-only local machine.

## Before (Full Unoptimized Release Build)
------
* **Clean build**: > 4 hours (frequently hits Out of Memory / Swap limits)
* **Incremental build**: > 10 minutes
* **Single-file build**: > 2-3 minutes

## After (SlaveDev Component Build)
-----
* **Clean/local development**: ~ 1.5 - 2 hours (estimated)
* **Incremental**: ~ 30-45 seconds
* **Single-file (`build-file.sh`)**: ~ 20 seconds (Ninja initialization + single compile)

## Remote (GitHub Actions)
------
* **GitHub build (Clean, without caching)**: Highly likely to OOM or run out of disk space on a standard runner.
* **Cache hit (sccache / depot_tools cache)**: ~ 3-5 minutes
* **Cache miss**: > 2 hours (if disk space allows)

> **Note:** True instantaneous remote compilation for Chromium usually requires a distributed build cluster like Reclient / RBE. The GitHub Actions workflows here act as a zero-cost CI mechanism rather than a high-speed remote development cluster.
