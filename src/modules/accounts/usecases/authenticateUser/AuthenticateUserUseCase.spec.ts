import { AppError } from '@shared/errors/AppError';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it('should be able to authenticate an user', async () => {
        const user: ICreateUserDTO = {
            driver_license: '000123',
            email: 'test@test.com',
            password: '1234',
            name: 'User Test',
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty('token');
    });

    it('should not be able to authenticate nonexistent user', async () => {
        expect(async () => {
            const result = await authenticateUserUseCase.execute({
                email: 'false@email.com',
                password: '1234',
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with incorrect password', async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                driver_license: '999999',
                email: 'user@user.com',
                password: '1234',
                name: 'User Test Error',
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: '4321',
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with incorrect email', async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                driver_license: '111222',
                email: 'wrong@wrong.com',
                password: '1234',
                name: 'User Test Error Email',
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: 'random@email.com',
                password: user.password,
            });
            
        }).rejects.toBeInstanceOf(AppError);
    });
});
