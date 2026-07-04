export abstract class BaseMapper<TEntity, TDto> {
  abstract toDto(entity: TEntity): TDto;

  toDtoList(entities: TEntity[]): TDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}