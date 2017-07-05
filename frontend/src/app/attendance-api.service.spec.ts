import { TestBed, inject } from '@angular/core/testing';

import { AttendanceApiService } from './attendance-api.service';

describe('AttendanceApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttendanceApiService]
    });
  });

  it('should ...', inject([AttendanceApiService], (service: AttendanceApiService) => {
    expect(service).toBeTruthy();
  }));
});
