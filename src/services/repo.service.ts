import { getManager, Repository } from 'typeorm';

const repositories: HydratedRepo[] = [];

export function Repo<T>(Entity: any): HydratedRepo {
    if(!repositories[ Entity.name ]) {
        repositories[Entity.name] = new HydratedRepo ( Entity );
    }
    return repositories[Entity.name];
}

class HydratedRepo {
    // Entity: any;
    public internalRepo: Repository<any>;

    constructor(Entity: any) {
        this.internalRepo = getManager().getRepository(Entity);
        // this.Entity = Entity
    }

    async insert(obj: any) {
        const newEntity = this.internalRepo.create(obj);
        return await this.internalRepo.save(newEntity);
    }

    async findById(id: number|string) {
        return await this.internalRepo.findOne(id);
    }

    async findOne(filter: any) {
        return (await this.internalRepo.find(filter))[0];
    }

    async find(filter?: any) {
        return await this.internalRepo.find(filter);
    }

    async update(obj: any) {
        try {
            const updatedUser = await this.internalRepo.save(obj);
            return updatedUser;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

/*
export class EntitiesService {
    static repositories: Repository<any>[] = [];
    static logger: ILogger = new Logger(__filename);

    static getRepository(entity: any) {
        if(!repositories[entity.name]) {
            repositories[entity.name] = getManager().getRepository(entity);
        }
        return repositories[entity.name];
    }

    static async insert(entity: any, object: any) {
        const repository = this.getRepository(entity);
        this.logger.info('Create a new ', entity.name, object);
        const newUser = repository.create(object);
        return await repository.save(newUser);
    }

    static async getAll(entity: any): Promise<any[]> {
        return await this.getRepository(entity).find();
    }
    
    /**
     * Creates an instance of User.
     */
    //instantiate(data: Object): User | undefined {
    //    return this.userRepository.create(data);
   // }

    /**
     * Inserts a new User into the database.
     */
    //async xinsert(data: User): Promise<User> {
    //    this.logger.info('Create a new user', data);
    //    const newUser = this.userRepository.create(data);
    //    return await this.userRepository.save(newUser);
    //}

    /**
     * Returns array of all users from db
     */
    //async getAll(): Promise<User[]> {
    //    return await this.userRepository.find();
    //}

    /**
     * Returns a user by given id
     */
    //async getById(id: string | number): Promise<User> {
    //    this.logger.info('Fetching user by id: ', id);
    //    if (id) {
    //        return await this.userRepository.findOne(id);
    //    }
    //    return Promise.reject(false);
    //}

    /**
     * Returns a user by email
     */
    //async getByEmail(email: string): Promise<User | undefined> {
    //    const users = await this.userRepository.find({
    //        where: {
    //            email: email
     //       }
    //    });
    //    if (users && users.length > 0) {
    //        return users[0];  // typeorm find() returns array even if response is single object
    //    } else {
    //        return undefined;
     //   }
    //}

    /**
     * Updates a user
     */
    //async update(user: User): Promise<User | undefined> {
    //    try {
     //       const updatedUser = await this.userRepository.save(user);
    //        return updatedUser;
    //    } catch (error) {
    //        return Promise.reject(error);
    //    }
    //}
//}
