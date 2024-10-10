import { NgModule } from '@angular/core';
import { HduHttpService } from '../services/hdu-http.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  providers: [HduHttpService],
})
export class HduApiHttpClientModule {}
