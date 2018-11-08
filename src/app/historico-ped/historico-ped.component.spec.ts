import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoPedComponent } from './historico-ped.component';

describe('HistoricoPedComponent', () => {
  let component: HistoricoPedComponent;
  let fixture: ComponentFixture<HistoricoPedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoPedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoPedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
