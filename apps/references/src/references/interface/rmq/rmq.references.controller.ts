import { Controller } from '@nestjs/common';
import { ReferencesService } from '../../application/references.service';

@Controller()
export class RmqReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}
}
