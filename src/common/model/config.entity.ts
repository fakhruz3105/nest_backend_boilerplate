import { Column, Entity } from 'typeorm';
import { AppEntity } from './app.entity';

@Entity()
export class Config extends AppEntity {
  @Column({ type: 'varchar', length: 120 })
  public key: string;

  @Column({ type: 'json', default: {} })
  public value: Record<string, any>;
}
