import { IMoveRepository } from 'src/domain/repositories/move.repository';

export const newMoveRepositoryMock = (): jest.Mocked<IMoveRepository> => {
  return {
    create: jest.fn(),
    getByEntity: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};
