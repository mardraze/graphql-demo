const users = [
    {
        id: 1,
        email: 'user1@example.com',
        password: 'aaa'
    },
    {
        id: 2,
        email: 'user2@example.com',
        password: 'bbb'
    }
];


const userControl = {
    login(email, password){
        let item;
        for(let i=0; i<users.length; i++){
            item = users[i];
            if(item.email === email && item.password === password){
                return item;
            }
        }
    },
    find(id){
        for(let i=0; i<users.length; i++){
            item = users[i];
            if(item.id === id){
                return item;
            }
        }
    }
};

module.exports = userControl
