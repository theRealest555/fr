import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const requestId = `${req.method}-${req.url}`;

  const skipLoading = req.headers.get('x-skip-loading') === 'true';

  if (!skipLoading) {
    loadingService.setLoading(requestId, true);
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loadingService.setLoading(requestId, false);
      }
    })
  );
};
