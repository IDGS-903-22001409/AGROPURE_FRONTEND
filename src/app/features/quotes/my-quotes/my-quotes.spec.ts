import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuotes } from './my-quotes';

describe('MyQuotes', () => {
  let component: MyQuotes;
  let fixture: ComponentFixture<MyQuotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyQuotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyQuotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
