const mockUser = {
    _id: 'test-user-id',
    username: 'testuser',
    password: 'hashedpassword123'
};

const User = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(mockUser)
};

export default User;