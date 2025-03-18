```typescript
@Module({
  imports: [RmqModule.forFeature('queue_name')],
  controllers: [SomeController],
  providers: [SomeService],
})
export class SomeModule {}
```