# Performance Ledger

This file tracks performance optimizations and experiments in the SIARSIP repository, including reverted ones.

| Idea | Target Bottleneck | Verdict | Why |
|---|---|---|---|
| Cache Google Drive API calls in `ArchiveFileController` | High latency when loading Arsip (Surat Masuk/Keluar) page due to synchronous Google API requests. | **Kept** | Directly addresses network latency. The Google Drive API takes several seconds to return files. By using `Cache::remember` for 5 minutes, we avoid the N+1 and slow API bottleneck for subsequent loads, improving TTFB significantly. |
