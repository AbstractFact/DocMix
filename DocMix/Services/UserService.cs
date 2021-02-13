using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocMix.Models;
using MongoDB.Driver;
using DocMix.DTOs;

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

        public List<MyDoc> GetUserDocsFiltered(string id, FiltersDTO filters)
        {
            User user = _users.Find<User>(u => u.ID == id).FirstOrDefault();
            List<MyDoc> mydocs = user.MyDocs;

            if (filters.Name!="")
                mydocs = mydocs.Where(md=>md.Name==filters.Name).ToList();
            if (filters.Category!="0")
                mydocs = mydocs.Where(md => md.Category == filters.Category).ToList();
            if (filters.Access != "0")
                mydocs = mydocs.Where(md => (md.Public? "Public":"Private") == filters.Access).ToList();

            return mydocs;
        }

        public bool DeleteDoc(string author, string doc)
        {
            var filter = Builders<User>.Filter.Where(u => u.ID == author);
            var update = Builders<User>.Update.PullFilter(u => u.MyDocs, Builders<MyDoc>.Filter.Where(d => d.ID == doc));
            _users.UpdateOne(filter, update);

            return true;
        }

        public void Update(Doc doc)
        {
            MyDoc mdoc = new MyDoc();
            mdoc.ID = doc.ID;
            mdoc.Category = doc.Category;
            mdoc.Name = doc.Name;
            mdoc.Public = doc.Public;

            var filter = Builders<User>.Filter.Eq(x => x.ID, doc.Author.ID) &
                Builders<User>.Filter.ElemMatch(doc => doc.MyDocs, el => el.ID == doc.ID);

            var update = Builders<User>.Update.Set(doc => doc.MyDocs[-1], mdoc);

            //Col.UpdateOne(filter, update);

            //var update = Builders<User>.Update.Set(u => u.MyDocs, Builders<MyDoc>.Filter.Where(d => d.ID == doc))
            //var update = Builders<User>.Update("PageNum", num);

            _users.UpdateOne(filter, update);
        }
    }
}

