import { TestBed, inject } from '@angular/core/testing';

import { ImpressaoService } from './impressao.service';

describe('ImpressaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImpressaoService]
    });
  });

  it('should be created', inject([ImpressaoService], (service: ImpressaoService) => {
    expect(service).toBeTruthy();
  }));
});
