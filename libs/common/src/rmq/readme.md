```typescript
@Module({
  imports: [RabbitmqModule.forFeature('queue_name')],
  controllers: [SomeController],
  providers: [SomeService],
})
export class SomeModule {}
```