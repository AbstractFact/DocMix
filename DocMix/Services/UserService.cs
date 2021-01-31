using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocMix.Models;
using MongoDB.Driver;

namespace DocMix.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IDocMixDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _users = database.GetCollection<User>("Users");
        }

        public List<User> Get() =>
            _users.Find(u => true).ToList();

        public User Get(string id) =>
            _users.Find<User>(u => u.ID == id).FirstOrDefault();

        public User Create(User user)
        {
            _users.InsertOne(user);
            return user;
        }

        public void Update(string id, User newuser) =>
           _users.ReplaceOne(u => u.ID == id, newuser);

        public void Remove(User user) =>
            _users.DeleteOne(u => u.ID == user.ID);

        public void Remove(string id) =>
            _users.DeleteOne(u => u.ID == id);

        public User Login(string username, string password)
        {
            return _users.Find<User>(u => u.Username == username && u.Password==password).FirstOrDefault();
        }

        public List<MyDoc> GetUserDocs(string id)
        {
            User user = _users.Find<User>(u => u.ID == id).FirstOrDefault();
            return user.MyDocs;
        }

        public bool DeleteDoc(string author, string doc)
        {
            var filter = Builders<User>.Filter.Where(u => u.ID == author);
            var update = Builders<User>.Update.PullFilter(u => u.MyDocs, Builders<MyDoc>.Filter.Where(d => d.ID == doc));
            _users.UpdateOne(filter, update);

            return true;
        }
    }
}
